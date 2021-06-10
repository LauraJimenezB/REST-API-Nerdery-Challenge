import { Expose, Exclude } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { BaseDto } from './base.dto';

@Exclude()
export class SigninUserDto extends BaseDto {

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  @Length(6, 20)
  readonly password: string;

}
