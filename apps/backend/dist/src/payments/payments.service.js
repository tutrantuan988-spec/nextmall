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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let StripeLib;
try {
    StripeLib = require('stripe');
    if (StripeLib.default)
        StripeLib = StripeLib.default;
}
catch {
    StripeLib = null;
}
let PaymentsService = PaymentsService_1 = class PaymentsService {
    configService;
    stripe = null;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(configService) {
        this.configService = configService;
        try {
            const apiKey = this.configService.get('STRIPE_SECRET_KEY') ||
                process.env.STRIPE_SECRET_KEY;
            if (!apiKey || apiKey === 'sk_test_dummy123456' || !StripeLib) {
                this.logger.warn('STRIPE_SECRET_KEY is missing or is a dummy key. Payments are DISABLED.');
                this.stripe = null;
            }
            else {
                this.stripe = new StripeLib(apiKey, {
                    apiVersion: '2023-10-16',
                });
                this.logger.log('Stripe initialized successfully.');
            }
        }
        catch (error) {
            this.logger.error(`Stripe initialization failed: ${error.message}`);
            this.stripe = null;
        }
    }
    ensureStripe() {
        if (!this.stripe) {
            throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in environment variables.');
        }
        return this.stripe;
    }
    async createCheckoutSession(order) {
        const stripe = this.ensureStripe();
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const session = await stripe.checkout.sessions.create({
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
            success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
            cancel_url: `${baseUrl}/checkout/cancel?order_id=${order.id}`,
            customer_email: order.email,
            metadata: {
                orderId: order.id,
            },
        });
        return { url: session.url };
    }
    async createPaymentIntent(amount) {
        const stripe = this.ensureStripe();
        try {
            this.logger.log(`[Stripe] Creating PaymentIntent for amount: ${amount} VND`);
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'vnd',
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            this.logger.log(`[Stripe] Success! PaymentIntent created: ${paymentIntent.id}`);
            return { clientSecret: paymentIntent.client_secret };
        }
        catch (error) {
            this.logger.error(`[Stripe] Could not create payment: ${error.message}`);
            throw error;
        }
    }
    async constructEventFromPayload(signature, payload) {
        const stripe = this.ensureStripe();
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        return stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map