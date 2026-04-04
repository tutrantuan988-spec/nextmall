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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
let PaymentsService = class PaymentsService {
    configService;
    stripe;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('STRIPE_SECRET_KEY') || process.env.STRIPE_SECRET_KEY;
        if (!apiKey) {
            console.error('CRITICAL: STRIPE_SECRET_KEY is missing in environment variables.');
        }
        this.stripe = new stripe_1.default(apiKey || '', {
            apiVersion: '2023-10-16',
        });
    }
    async createCheckoutSession(order) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: `Đơn hàng #${order.id}`,
                        },
                        unit_amount: order.totalAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
            cancel_url: `http://localhost:3000/checkout/cancel?order_id=${order.id}`,
            customer_email: order.email,
            metadata: {
                orderId: order.id,
            },
        });
        return { url: session.url };
    }
    async createPaymentIntent(amount) {
        try {
            console.log(`[Stripe] Creating PaymentIntent for amount: ${amount} VND`);
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency: 'vnd',
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            console.log(`[Stripe] Success! PaymentIntent created: ${paymentIntent.id}`);
            return { clientSecret: paymentIntent.client_secret };
        }
        catch (error) {
            console.error(`[Stripe] CRITICAL: Could not initialize payment!`);
            console.error(`[Stripe] Error Message: ${error.message}`);
            if (error.raw) {
                console.error(`[Stripe] Raw Error: ${JSON.stringify(error.raw, null, 2)}`);
            }
            throw error;
        }
    }
    async constructEventFromPayload(signature, payload) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map