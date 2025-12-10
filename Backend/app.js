import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import config from './config/index.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter.js';
import { createDirectoryIfNotExists } from './utils/fileHelper.js';

// Import routers
import authRouter from './router/authRouter.js';
import postRouter from './router/postRouter.js';
import userRouter from './router/userRouter.js';

const app = express();

/**
 * ============================================
 * Trust Proxy Configuration
 * ============================================
 */
app.set('trust proxy', 1);

/**
 * ============================================
 * Security Middleware
 * ============================================
 */
app.use(helmet());
app.use(mongoSanitize());

/**
 * ============================================
 * Logging Middleware
 * ============================================
 */
if (config.logging.enableRequestLogging) {
  app.use(morgan(':date[iso] :method :url :status :response-time ms'));
}

/**
 * ============================================
 * Body Parser Middleware
 * ============================================
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * ============================================
 * Cookie & File Upload Middleware
 * ============================================
 */
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    safeFileNames: true,
    preserveExtension: true,
  })
);

/**
 * ============================================
 * Compression Middleware
 * ============================================
 */
app.use(compression());

/**
 * ============================================
 * CORS Configuration
 * ============================================
 */
app.use(
  cors({
    origin: config.security.corsOrigin,
    credentials: config.security.corsAllowCredentials,
    methods: config.security.corsAllowMethods,
    allowedHeaders: config.security.corsAllowHeaders,
  })
);

/**
 * ============================================
 * Create Upload Directories
 * ============================================
 */
createDirectoryIfNotExists(config.upload.uploadDir);
createDirectoryIfNotExists(config.logging.dir);

/**
 * ============================================
 * Health Check Endpoint
 * ============================================
 */
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * ============================================
 * API Routes
 * ============================================
 */
app.use(`${config.app.apiPrefix}/auth`, authRouter);
app.use(`${config.app.apiPrefix}/posts`, postRouter);
app.use(`${config.app.apiPrefix}/users`, userRouter);

/**
 * ============================================
 * Swagger Documentation
 * ============================================
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${config.app.name} API`,
      version: config.app.version,
      description: 'Professional Social Media Platform REST API',
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./router/*.js', './controller/*.js'],
};

app.use(`${config.app.apiPrefix}/docs`, swaggerUi.serve);

/**
 * ============================================
 * 404 Handler
 * ============================================
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
  });
});

/**
 * ============================================
 * Global Error Handler
 * ============================================
 */
app.use(errorMiddleware);

export default app;
