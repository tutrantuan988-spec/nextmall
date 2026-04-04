import { PrismaService } from '../prisma/prisma.service';
export declare class CouponsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
