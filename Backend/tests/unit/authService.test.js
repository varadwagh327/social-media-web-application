/**
 * Unit Tests for Authentication Service
 */
import AuthService from '../../services/authService.js';
import User from '../../models/userSchema.js';
import { ErrorHandler } from '../../middlewares/errorMiddleware.js';

// Mock mongoose model
jest.mock('../../models/userSchema.js');

describe('AuthService', () => {
  describe('signup', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!',
        fullName: 'Test User',
      };

      User.findOne.mockResolvedValueOnce(null);

      const saveMock = jest.fn().mockResolvedValue({
        _id: 'user123',
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: 'user',
        toObject: jest.fn(() => ({
          _id: 'user123',
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          role: 'user',
        })),
      });

      User.mockImplementationOnce(() => ({
        save: saveMock,
      }));

      const result = await AuthService.signup(userData);

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'TestPassword123!',
      };

      User.findOne.mockResolvedValueOnce({
        email: userData.email,
      });

      try {
        await AuthService.signup(userData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toContain('Email already registered');
      }
    });

    it('should throw error if username already exists', async () => {
      const userData = {
        username: 'existinguser',
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      User.findOne.mockResolvedValueOnce({
        username: userData.username,
      });

      try {
        await AuthService.signup(userData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toContain('Username already taken');
      }
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const mockUser = {
        _id: 'user123',
        email: loginData.email,
        password: 'hashedPassword',
        isActive: true,
        role: 'user',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn(() => ({
          _id: 'user123',
          email: loginData.email,
          role: 'user',
        })),
      };

      User.findOne.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await AuthService.login(loginData);

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
    });

    it('should throw error if email or password is missing', async () => {
      try {
        await AuthService.login({
          email: 'test@example.com',
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });

    it('should throw error if invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      User.findOne.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue(null),
      });

      try {
        await AuthService.login(loginData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.statusCode).toBe(401);
      }
    });
  });
});
