import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Backend is alive',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('api/health')
  getApiHealth() {
    return {
      status: 'ok',
      message: 'Backend is alive',
      timestamp: new Date().toISOString(),
    };
  }
}
