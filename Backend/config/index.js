import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config.env') });

const config = {
  app: {
    name: process.env.APP_NAME || 'Social Media API',
    version: process.env.APP_VERSION || '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 5000,
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media-db',
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    dbName: process.env.MONGODB_DB_NAME || 'social-media-db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      retryReads: true,
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-this',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
    algorithm: 'HS256',
  },

  security: {
    corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
    cookieSecure: process.env.COOKIE_SECURE === 'true',
    cookieSameSite: process.env.COOKIE_SAME_SITE || 'Lax',
    corsAllowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    corsAllowHeaders: ['Content-Type', 'Authorization'],
    corsAllowCredentials: true,
  },

  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, 
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 10,
    adminMaxRequests: parseInt(process.env.ADMIN_RATE_LIMIT_MAX_REQUESTS) || 200,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  upload: {
    maxSize: parseInt(process.env.MAX_UPLOAD_SIZE) || 52428800, 
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,mp4,webm,mov,avi').split(','),
    s3Enabled: process.env.S3_ENABLED === 'true',
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_REGION || 'us-east-1',
  },

  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    cacheTTL: parseInt(process.env.CACHE_TTL) || 3600,
  },

  email: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT) || 587,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@socialmedia.com',
    fromName: process.env.SMTP_FROM_NAME || 'Social Media',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || './logs',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  },

  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 20,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100,
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3000',
  },
};

export default config;
