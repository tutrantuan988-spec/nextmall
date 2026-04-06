import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
    if (globalForPrisma.prisma) {
      Object.assign(this, globalForPrisma.prisma);
    } else {
      globalForPrisma.prisma = this;
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established.');
    } catch (error: any) {
      this.logger.error(`Failed to connect to database: ${error.message}`);
      // Do NOT rethrow — allow the app to bootstrap without DB if needed
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
