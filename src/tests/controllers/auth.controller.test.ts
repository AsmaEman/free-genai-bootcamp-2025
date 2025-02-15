import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/appError';
import bcrypt from 'bcrypt';

// Mock AuthService and bcrypt
jest.mock('../../services/auth.service');
jest.mock('bcrypt');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    authController = new AuthController();
    mockRequest = { body: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();

    // Reset mocks on the AuthService prototype methods if needed
    (AuthService.prototype.register as jest.Mock).mockReset();
    (AuthService.prototype.login as jest.Mock).mockReset();

    // Reset bcrypt hash mock
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
  });

  describe('register', () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should successfully register a user', async () => {
      mockRequest.body = mockUserData;
      const mockUser = { 
        ...mockUserData, 
        id: '1', 
        isEmailVerified: false,
        passwordHash: 'hashed_password'
      };
      
      // Simulate a successful registration
      (AuthService.prototype.register as jest.Mock).mockResolvedValueOnce(mockUser);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email
        })
      });
    });

    it('should handle missing required fields', async () => {
      // Provide incomplete user data
      mockRequest.body = { email: 'test@example.com' };

      // Simulate the service throwing an error for missing required fields
      (AuthService.prototype.register as jest.Mock).mockImplementationOnce(() => {
        throw new AppError(400, 'Missing required fields');
      });

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      // Verify that next() was called with an AppError instance
      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login user', async () => {
      mockRequest.body = mockCredentials;
      const mockLoginResponse = {
        token: 'mock-token',
        user: { id: '1', email: mockCredentials.email },
      };

      (AuthService.prototype.login as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockLoginResponse,
      });
    });
  });
});
