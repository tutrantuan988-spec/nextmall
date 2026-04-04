import { Controller, Post, Body, Req, Headers, UnauthorizedException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import * as express from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('create-session')
  async createSession(
    @Body()
    order: { id: string; totalAmount: number; customerName: string; email: string },
  ) {
    return this.paymentsService.createCheckoutSession(order);
  }

  @Post('create-intent')
  async createIntent(
    @Body()
    data: { amount: number },
  ) {
    return this.paymentsService.createPaymentIntent(data.amount);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<express.Request>,
  ) {
    if (!signature) {
      throw new UnauthorizedException('Missing stripe-signature header');
    }

    const payload = request.rawBody;
    if (!payload) {
      throw new UnauthorizedException('Missing raw body');
    }

    try {
      const event = await this.paymentsService.constructEventFromPayload(signature, payload);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await this.ordersService.updateStatus(orderId, 'PAID');
        }
      }

      return { received: true };
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      throw new UnauthorizedException(`Webhook Error: ${err.message}`);
    }
  }
}
