import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    example: "OldSecure1",
    description: "Поточний пароль",
    minLength: 9,
  })
  @IsString()
  @MinLength(9, { message: "Current password must be at least 9 characters" })
  current_password!: string;

  @ApiProperty({
    example: "NewSecure2",
    description: "Новий пароль: мін. 9 символів, 1 велика літера, 1 цифра",
    minLength: 9,
  })
  @IsString()
  @MinLength(9, { message: "New password must be at least 9 characters" })
  @Matches(/(?=.*[A-Z])/, {
    message: "New password must contain at least one uppercase letter",
  })
  @Matches(/(?=.*[0-9])/, {
    message: "New password must contain at least one digit",
  })
  new_password!: string;
}
