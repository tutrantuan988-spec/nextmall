import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY') || process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      console.error('CRITICAL: STRIPE_SECRET_KEY is missing in environment variables.');
    }
    this.stripe = new (Stripe as any)(apiKey || '', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(order: { id: string; totalAmount: number; customerName: string; email: string }) {
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

  async createPaymentIntent(amount: number) {
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
    } catch (error: any) {
      console.error(`[Stripe] CRITICAL: Could not initialize payment!`);
      console.error(`[Stripe] Error Message: ${error.message}`);
      if (error.raw) {
        console.error(`[Stripe] Raw Error: ${JSON.stringify(error.raw, null, 2)}`);
      }
      throw error;
    }
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
  }
}
