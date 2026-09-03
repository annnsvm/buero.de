import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Matches } from "class-validator";

export class VerifyRegistrationDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "123456", description: "6-digit code from email" })
  @Matches(/^\d{6}$/, { message: "Verification code must be 6 digits" })
  code!: string;
}
