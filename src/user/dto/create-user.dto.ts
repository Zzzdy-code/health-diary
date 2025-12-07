import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  openid: string;

  @IsString()
  @IsOptional()
  unionid?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  gender?: number;
}
