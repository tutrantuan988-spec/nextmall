import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async findAllActive() {
    return this.couponsService.findAllActive();
  }

  @Post('validate')
  async validate(@Body('code') code: string) {
    return this.couponsService.validate(code);
  }
}
