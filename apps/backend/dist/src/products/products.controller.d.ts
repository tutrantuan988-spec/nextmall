import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
    create(createProductDto: CreateProductDto): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
    sync(): Promise<{
        message: string;
    }>;
}
