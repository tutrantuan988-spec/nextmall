import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewsService } from '../reviews/reviews.service';
import { SearchService } from '../search/search.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewsService: ReviewsService,
    private readonly searchService: SearchService,
  ) {}

  async findAll(query: any) {
    const { search, category, brand } = query;
    const where: any = {};

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

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const reviewsStats = await this.reviewsService.getAverageRating(id);

    return {
      ...product,
      averageRating: reviewsStats.average,
      reviewCount: reviewsStats.count,
    };
  }

  async create(data: CreateProductDto) {
    const product = await this.prisma.product.create({
      data,
    });
    await this.searchService.indexProduct(product);
    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await this.prisma.product.update({
      where: { id },
      data,
    });
    await this.searchService.updateProduct(id, product);
    return product;
  }

  async remove(id: string) {
    await this.prisma.product.delete({
      where: { id },
    });
    await this.searchService.removeProduct(id);
    return { deleted: true };
  }

  async search(query: string) {
    return this.searchService.search(query);
  }

  // Helper method to sync all products (can be called once)
  async syncAllToElasticsearch() {
    const products = await this.prisma.product.findMany();
    console.log(`Found ${products.length} products to sync.`);
    for (const product of products) {
      console.log(`Syncing product: ${product.name}`);
      await this.searchService.indexProduct(product);
    }
    console.log('Sync complete.');
  }
}
