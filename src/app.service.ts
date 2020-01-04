import { BadRequestException, Injectable } from '@nestjs/common';
import * as Crawler from 'instagram-public-crawler';

@Injectable()
export class AppService {

  static async loadProfile(account: String):  Promise<any>{
    try {
      return await Crawler.lite(account, { raw: false });
    }catch (e) {
      throw new BadRequestException('Profile not found');
    }
  }

  static async getProfile(account: String): Promise<any> {
    return await AppService.loadProfile(account);
  }


}
