/**
 * Integration Tests for Auth Routes
 */
import request from 'supertest';
import app from '../../app.js';
import User from '../../models/userSchema.js';
import { dbConnection, disconnectDB } from '../../database/dbConnection.js';

describe('Auth Routes Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await dbConnection();
  });

  afterAll(async () => {
    // Disconnect from database
    await disconnectDB();
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/signup', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'TestPassword123!',
        fullName: 'New User',
      };

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should validate password strength', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'weak',
        fullName: 'New User',
      };

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should prevent duplicate email registration', async () => {
      const userData = {
        username: 'user1',
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      // First registration
      await request(app)
        .post('/api/v1/auth/signup')
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          ...userData,
          username: 'user2',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create user first
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      await request(app)
        .post('/api/v1/auth/signup')
        .send(userData);

      // Login
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should get current user with valid token', async () => {
      // Register and login user
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const signupResponse = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData);

      const token = signupResponse.body.data.accessToken;

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      // Register and login user
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const signupResponse = await request(app)
        .post('/api/v1/auth/signup')
        .send(userData);

      const token = signupResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
