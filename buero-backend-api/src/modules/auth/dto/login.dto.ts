import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "user@example.com", description: "Email користувача" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: "SecurePass1", description: "Пароль", minLength: 9 })
  @IsString()
  @IsNotEmpty()
  @MinLength(9, { message: "Password must be at least 9 characters" })
  password!: string;
}
