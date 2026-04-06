import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

let StripeLib: any;
try {
  StripeLib = require('stripe');
  if (StripeLib.default) StripeLib = StripeLib.default;
} catch {
  StripeLib = null;
}

@Injectable()
export class PaymentsService {
  private stripe: any = null;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private configService: ConfigService) {
    try {
      const apiKey =
        this.configService.get<string>('STRIPE_SECRET_KEY') ||
        process.env.STRIPE_SECRET_KEY;

      if (!apiKey || apiKey === 'sk_test_dummy123456' || !StripeLib) {
        this.logger.warn(
          'STRIPE_SECRET_KEY is missing or is a dummy key. Payments are DISABLED.',
        );
        this.stripe = null;
      } else {
        this.stripe = new StripeLib(apiKey, {
          apiVersion: '2023-10-16',
        });
        this.logger.log('Stripe initialized successfully.');
      }
    } catch (error: any) {
      this.logger.error(`Stripe initialization failed: ${error.message}`);
      this.stripe = null;
    }
  }

  private ensureStripe(): any {
    if (!this.stripe) {
      throw new Error(
        'Stripe is not configured. Set STRIPE_SECRET_KEY in environment variables.',
      );
    }
    return this.stripe;
  }

  async createCheckoutSession(order: {
    id: string;
    totalAmount: number;
    customerName: string;
    email: string;
  }) {
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

  async createPaymentIntent(amount: number) {
    const stripe = this.ensureStripe();
    try {
      this.logger.log(
        `[Stripe] Creating PaymentIntent for amount: ${amount} VND`,
      );
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'vnd',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(
        `[Stripe] Success! PaymentIntent created: ${paymentIntent.id}`,
      );
      return { clientSecret: paymentIntent.client_secret };
    } catch (error: any) {
      this.logger.error(`[Stripe] Could not create payment: ${error.message}`);
      throw error;
    }
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    const stripe = this.ensureStripe();
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret || '',
    );
  }
}
