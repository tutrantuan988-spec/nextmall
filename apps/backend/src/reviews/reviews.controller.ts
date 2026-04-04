import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  async create(
    @Param('productId') productId: string,
    @Req() req,
    @Body() data: { rating: number; comment?: string },
  ) {
    return this.reviewsService.create(productId, req.user.id, data);
  }

  @Get(':productId')
  async findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Get(':productId/average')
  async getAverageRating(@Param('productId') productId: string) {
    return this.reviewsService.getAverageRating(productId);
  }
}
