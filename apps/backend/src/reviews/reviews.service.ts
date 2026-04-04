import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(productId: string, userId: string, data: { rating: number; comment?: string }) {
    return this.prisma.review.create({
      data: {
        productId,
        userId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAverageRating(productId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      average: aggregate._avg.rating || 0,
      count: aggregate._count.rating || 0,
    };
  }
}
