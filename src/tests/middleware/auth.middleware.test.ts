import { verifyToken } from '../../middleware/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/appError';
import config from '../../config';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request & { user?: any }>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      user: undefined
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should throw error if no token provided', async () => {
    await verifyToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(
      new AppError(401, 'No token provided')
    );
  });

  it('should verify valid token and add user to request', async () => {
    const mockToken = 'valid-token';
    const mockUser = { id: '1', email: 'test@example.com' };

    mockRequest.headers = {
      authorization: `Bearer ${mockToken}`,
    };

    (jwt.verify as jest.Mock).mockImplementationOnce((token, secret, callback) => {
      callback(null, mockUser);
    });

    await verifyToken(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalledWith();
  });
}); 