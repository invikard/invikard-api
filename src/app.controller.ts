import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getProfile(@Query('account') account): Promise<any> {
    return AppService.getProfile(account);
  }
}
