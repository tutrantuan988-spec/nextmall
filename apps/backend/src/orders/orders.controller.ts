import { Controller, Post, Body, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMyOrders(@Req() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('stats')
  async getStats() {
    const orders = await this.ordersService.findAll();
    const totalSales = orders
      .filter((o) => o.status === 'DELIVERED' || o.status === 'SHIPPING')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;

    const outOfStockCount = await this.prisma.product.count({
      where: { stock: { lte: 0 } },
    });

    return {
      totalSales,
      totalOrders,
      outOfStockCount,
    };
  }

  @Post()
  async create(
    @Body()
    data: {
      customerName: string;
      email: string;
      address: string;
      totalAmount: number;
      userId?: string;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    return this.ordersService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
