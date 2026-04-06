"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught Exception:', err.message);
    console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
    console.error('[FATAL] Unhandled Rejection:', reason?.message || reason);
    if (reason?.stack)
        console.error(reason.stack);
});
async function bootstrap() {
    try {
        console.log('[Bootstrap] Starting NestJS application...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            rawBody: true,
            logger: ['error', 'warn', 'log'],
        });
        app.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
        await app.init();
        console.log('[Bootstrap] NestJS application initialized successfully.');
        return app.getHttpAdapter().getInstance();
    }
    catch (error) {
        console.error('[Bootstrap] FATAL: Failed to initialize NestJS application!');
        console.error('[Bootstrap] Error:', error.message);
        console.error(error.stack);
        return (req, res) => {
            res.status(500).json({
                status: 'error',
                message: 'Backend failed to initialize',
                error: error.message,
            });
        };
    }
}
const server = bootstrap();
exports.default = async (req, res) => {
    const instance = await server;
    instance(req, res);
};
//# sourceMappingURL=main.js.map