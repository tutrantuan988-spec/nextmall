import { PrismaService } from '../prisma/prisma.service';
import { ReviewsService } from '../reviews/reviews.service';
import { SearchService } from '../search/search.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    private readonly reviewsService;
    private readonly searchService;
    constructor(prisma: PrismaService, reviewsService: ReviewsService, searchService: SearchService);
    findAll(query: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string;
        category: string;
        brand: string;
        createdAt: Date;
    }[]>;
    getCategories(): Promise<{
        name: string;
        count: number;
    }[]>;
    getBrands(): Promise<{
        name: string;
        count: number;
    }[]>;
    findOne(id: string): Promise<{
        averageRating: number;
        reviewCount: number;
        id: string;
        name: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string;
        category: string;
        brand: string;
        createdAt: Date;
    }>;
    create(data: CreateProductDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string;
        category: string;
        brand: string;
        createdAt: Date;
    }>;
    update(id: string, data: UpdateProductDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        originalPrice: number | null;
        stock: number;
        sold: number;
        rating: number;
        imageUrl: string;
        category: string;
        brand: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    search(query: string): Promise<any>;
    syncAllToElasticsearch(): Promise<void>;
}
