import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Global error handlers to prevent silent crashes in serverless
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('[FATAL] Unhandled Rejection:', reason?.message || reason);
  if (reason?.stack) console.error(reason.stack);
});

async function bootstrap() {
  try {
    console.log('[Bootstrap] Starting NestJS application...');

    const app = await NestFactory.create(AppModule, {
      rawBody: true,
      logger: ['error', 'warn', 'log'],
    });

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
    console.log('[Bootstrap] NestJS application initialized successfully.');
    return app.getHttpAdapter().getInstance();
  } catch (error: any) {
    console.error('[Bootstrap] FATAL: Failed to initialize NestJS application!');
    console.error('[Bootstrap] Error:', error.message);
    console.error(error.stack);

    // Return a minimal Express-like handler that reports the error
    return (req: any, res: any) => {
      res.status(500).json({
        status: 'error',
        message: 'Backend failed to initialize',
        error: error.message,
      });
    };
  }
}

const server = bootstrap();

export default async (req: any, res: any) => {
  const instance = await server;
  instance(req, res);
};
