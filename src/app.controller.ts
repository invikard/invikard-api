import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AppDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getProfile(@Query() query: AppDto): Promise<any> {
    return AppService.getProfile(query.account);
  }
}
