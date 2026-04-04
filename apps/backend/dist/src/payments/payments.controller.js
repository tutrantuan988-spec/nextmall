"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const orders_service_1 = require("../orders/orders.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    ordersService;
    constructor(paymentsService, ordersService) {
        this.paymentsService = paymentsService;
        this.ordersService = ordersService;
    }
    async createSession(order) {
        return this.paymentsService.createCheckoutSession(order);
    }
    async createIntent(data) {
        return this.paymentsService.createPaymentIntent(data.amount);
    }
    async handleWebhook(signature, request) {
        if (!signature) {
            throw new common_1.UnauthorizedException('Missing stripe-signature header');
        }
        const payload = request.rawBody;
        if (!payload) {
            throw new common_1.UnauthorizedException('Missing raw body');
        }
        try {
            const event = await this.paymentsService.constructEventFromPayload(signature, payload);
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const orderId = session.metadata?.orderId;
                if (orderId) {
                    await this.ordersService.updateStatus(orderId, 'PAID');
                }
            }
            return { received: true };
        }
        catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            throw new common_1.UnauthorizedException(`Webhook Error: ${err.message}`);
        }
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('create-session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createSession", null);
__decorate([
    (0, common_1.Post)('create-intent'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createIntent", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        orders_service_1.OrdersService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map