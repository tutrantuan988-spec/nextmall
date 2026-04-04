import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                price: number;
                imageUrl: string;
                createdAt: Date;
                stock: number;
                category: string;
                brand: string;
                originalPrice: number | null;
                sold: number;
                rating: number;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        email: string;
        customerName: string;
        address: string;
        totalAmount: number;
        status: string;
    })[]>;
    findByUser(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                description: string | null;
                price: number;
                imageUrl: string;
                createdAt: Date;
                stock: number;
                category: string;
                brand: string;
                originalPrice: number | null;
                sold: number;
                rating: number;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            orderId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        email: string;
        customerName: string;
        address: string;
        totalAmount: number;
        status: string;
    })[]>;
    create(data: {
        customerName: string;
        email: string;
        address: string;
        totalAmount: number;
        userId?: string;
        items: {
            productId: string;
            quantity: number;
            price: number;
        }[];
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        email: string;
        customerName: string;
        address: string;
        totalAmount: number;
        status: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        email: string;
        customerName: string;
        address: string;
        totalAmount: number;
        status: string;
    }>;
}
