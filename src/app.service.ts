import { BadRequestException, Injectable } from '@nestjs/common';
import * as Crawler from 'instagram-public-crawler';

@Injectable()
export class AppService {

  static async loadProfile():  Promise<any>{
    try {
      return await Crawler.lite("permanahendra", { raw: false });
    }catch (e) {
      throw new BadRequestException('Profile not found');
    }
  }

  static async getProfile(): Promise<any> {
    return await AppService.loadProfile();
  }


}
