import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(productId: string, req: any, data: {
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
