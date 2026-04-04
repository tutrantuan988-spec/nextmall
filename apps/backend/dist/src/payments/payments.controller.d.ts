import type { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import * as express from 'express';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly ordersService;
    constructor(paymentsService: PaymentsService, ordersService: OrdersService);
    createSession(order: {
        id: string;
        totalAmount: number;
        customerName: string;
        email: string;
    }): Promise<{
        url: any;
    }>;
    createIntent(data: {
        amount: number;
    }): Promise<{
        clientSecret: any;
    }>;
    handleWebhook(signature: string, request: RawBodyRequest<express.Request>): Promise<{
        received: boolean;
    }>;
}
