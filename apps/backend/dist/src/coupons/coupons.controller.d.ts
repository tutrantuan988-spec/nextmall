import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    findAllActive(): Promise<{
        id: string;
        createdAt: Date;
        code: string;
        discountAmount: number;
        expiryDate: Date;
        isActive: boolean;
    }[]>;
    validate(code: string): Promise<{
        valid: boolean;
        message: string;
        coupon?: undefined;
    } | {
        valid: boolean;
        coupon: {
            id: string;
            createdAt: Date;
            code: string;
            discountAmount: number;
            expiryDate: Date;
            isActive: boolean;
        };
        message?: undefined;
    }>;
}
