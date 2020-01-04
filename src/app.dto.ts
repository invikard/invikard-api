import { IsNotEmpty } from 'class-validator';

export class AppDto {

  @IsNotEmpty()
  readonly account: string;
}
