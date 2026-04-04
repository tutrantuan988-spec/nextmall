import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(productId: string, userId: string, data: {
        rating: number;
        comment?: string;
    }): Promise<{
        user: {
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        comment: string | null;
        userId: string;
        productId: string;
    }>;
    findByProduct(productId: string): Promise<({
        user: {
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        comment: string | null;
        userId: string;
        productId: string;
    })[]>;
    getAverageRating(productId: string): Promise<{
        average: number;
        count: number;
    }>;
}
