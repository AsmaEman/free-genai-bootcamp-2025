import { validate } from '../../middleware/validation.middleware';
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '../../utils/appError';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should pass validation with valid data', () => {
    const schema = {
      validate: jest.fn().mockReturnValue({ error: null })
    } as unknown as Schema;

    mockRequest.body = {
      email: 'test@example.com',
      password: 'password123',
    };

    const middleware = validate(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should throw error with invalid data', () => {
    const schema = {
      validate: jest.fn().mockReturnValue({
        error: {
          details: [{ message: 'Invalid email' }]
        }
      })
    } as unknown as Schema;

    mockRequest.body = {
      email: 'invalid-email',
      password: '12345',
    };

    const middleware = validate(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.any(AppError)
    );
  });
}); 