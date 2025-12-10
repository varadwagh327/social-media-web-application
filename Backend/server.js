import app from './app.js';
import config from './config/index.js';
import { dbConnection, checkDBHealth } from './database/dbConnection.js';

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to database
    await dbConnection();

    // Health check
    const dbHealth = await checkDBHealth();
    if (!dbHealth) {
      console.warn('⚠️  Database health check failed');
    }

    // Start server
    const server = app.listen(config.app.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                  ${config.app.name}                      ║
║                   Version ${config.app.version}                         ║
╠═══════════════════════════════════════════════════════════╣
║  🚀 Server running on port: ${config.app.port}                    ║
║  🔌 Environment: ${config.app.env}                         ║
║  📊 Database: Connected                              ║
║  🛡️  Security: Enabled                                ║
╚═══════════════════════════════════════════════════════════╝

API Documentation: http://localhost:${config.app.port}${config.app.apiPrefix}/docs
Health Check: http://localhost:${config.app.port}${config.app.apiPrefix}/health
      `);
    });

    /**
     * Handle unhandled promise rejections
     */
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Rejection:', err);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    /**
     * Handle uncaught exceptions
     */
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      process.exit(1);
    });

    /**
     * Handle SIGTERM
     */
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully');
      server.close(() => {
        console.log('✅ Process terminated');
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start server
startServer();

