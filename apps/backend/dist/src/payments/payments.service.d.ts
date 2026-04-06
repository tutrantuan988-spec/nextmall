import { ConfigService } from '@nestjs/config';
export declare class PaymentsService {
    private configService;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService);
    private ensureStripe;
    createCheckoutSession(order: {
        id: string;
        totalAmount: number;
        customerName: string;
        email: string;
    }): Promise<{
        url: any;
    }>;
    createPaymentIntent(amount: number): Promise<{
        clientSecret: any;
    }>;
    constructEventFromPayload(signature: string, payload: Buffer): Promise<any>;
}
