"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const reviews_service_1 = require("../reviews/reviews.service");
const search_service_1 = require("../search/search.service");
let ProductsService = class ProductsService {
    prisma;
    reviewsService;
    searchService;
    constructor(prisma, reviewsService, searchService) {
        this.prisma = prisma;
        this.reviewsService = reviewsService;
        this.searchService = searchService;
    }
    async findAll(query) {
        const { search, category, brand } = query;
        const where = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            where.category = category;
        }
        if (brand) {
            where.brand = brand;
        }
        return this.prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getCategories() {
        const categories = await this.prisma.product.groupBy({
            by: ['category'],
            _count: {
                category: true,
            },
        });
        return categories.map((c) => ({
            name: c.category,
            count: c._count.category,
        }));
    }
    async getBrands() {
        const brands = await this.prisma.product.groupBy({
            by: ['brand'],
            _count: {
                brand: true,
            },
        });
        return brands.map((b) => ({
            name: b.brand,
            count: b._count.brand,
        }));
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        const reviewsStats = await this.reviewsService.getAverageRating(id);
        return {
            ...product,
            averageRating: reviewsStats.average,
            reviewCount: reviewsStats.count,
        };
    }
    async create(data) {
        const product = await this.prisma.product.create({
            data,
        });
        await this.searchService.indexProduct(product);
        return product;
    }
    async update(id, data) {
        const product = await this.prisma.product.update({
            where: { id },
            data,
        });
        await this.searchService.updateProduct(id, product);
        return product;
    }
    async remove(id) {
        await this.prisma.product.delete({
            where: { id },
        });
        await this.searchService.removeProduct(id);
        return { deleted: true };
    }
    async search(query) {
        return this.searchService.search(query);
    }
    async syncAllToElasticsearch() {
        const products = await this.prisma.product.findMany();
        console.log(`Found ${products.length} products to sync.`);
        for (const product of products) {
            console.log(`Syncing product: ${product.name}`);
            await this.searchService.indexProduct(product);
        }
        console.log('Sync complete.');
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        reviews_service_1.ReviewsService,
        search_service_1.SearchService])
], ProductsService);
//# sourceMappingURL=products.service.js.map