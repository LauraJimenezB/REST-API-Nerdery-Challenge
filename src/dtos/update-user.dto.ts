import { Expose, Exclude } from 'class-transformer'
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import { BaseDto } from './base.dto'

@Exclude()
export class UpdateUserDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  username?: string

  @Expose()
  @IsEmail()
  @IsOptional()
  email?: string

  @Exclude()
  @IsString()
  @Length(6, 20)
  @IsOptional()
  password?: string

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  emailIsPublic?: boolean

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  fullname?: string

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  fullnameIsPublic?: boolean

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  bio?: string
}
