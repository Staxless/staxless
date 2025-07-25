// microservices/user-service/src/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty', // Pretty-print logs for development
    options: {
      colorize: true,
    },
  },
});

export default logger;
