import { BaseDto } from './base.dto';
import { IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class InputPostDto extends BaseDto {
  public id: number;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  public title: string;

  @IsOptional()
  @IsString()
  public content: string;

  @IsOptional()
  @IsBoolean()
  public published: boolean;
}
