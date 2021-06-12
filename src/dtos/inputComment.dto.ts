import { BaseDto } from './base.dto';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class InputCommentDto extends BaseDto {
  public id: number;

  @IsNotEmpty()
  @IsString()
  public content: string;

  @IsOptional()
  @IsBoolean()
  public published: boolean;
}
