import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.coupon.findMany({
      where: {
        isActive: true,
        expiryDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        discountAmount: 'desc',
      },
    });
  }

  async validate(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive || coupon.expiryDate < new Date()) {
      return { valid: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
    }

    return { valid: true, coupon };
  }
}
