import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export enum RoleEnum {
  student = "student",
  teacher = "teacher",
}

export enum LanguageEnum {
  en = "en",
  de = "de",
}

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Олена Петренко",
    description: "Ім'я для відображення",
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: "SecurePass1",
    description: "Min 9 chars, 1 uppercase, 1 digit",
  })
  @IsString()
  @MinLength(9, { message: "Password must be at least 9 characters" })
  @Matches(/(?=.*[A-Z])/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/(?=.*[0-9])/, {
    message: "Password must contain at least one digit",
  })
  password: string;

  @ApiProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @ApiPropertyOptional({ enum: LanguageEnum, default: "en" })
  @IsOptional()
  @IsEnum(LanguageEnum)
  language?: LanguageEnum;

  constructor() {
    this.email = "";
    this.name = "";
    this.password = "";
    this.role = RoleEnum.student;
  }
}
