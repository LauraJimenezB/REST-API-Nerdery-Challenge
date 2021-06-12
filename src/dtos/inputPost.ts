import { BaseDto } from './base.dto';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class InputPostDto extends BaseDto {
  public id: number;

  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  public title: string;

  @IsNotEmpty()
  @IsString()
  public content: string;

  @IsOptional()
  @IsBoolean()
  public published: boolean;
}
