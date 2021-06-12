import { BaseDto } from './base.dto';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCommentDto extends BaseDto {
  public id: number;

  @IsOptional()   
  @IsNotEmpty()
  @IsString()
  public content: string;

  @IsOptional()
  @IsBoolean()
  public published: boolean;
}
