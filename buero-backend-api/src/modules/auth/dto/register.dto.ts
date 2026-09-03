import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import { CreateUserDto } from "../../user/dto/create-user.dto";

export class RegisterDto extends CreateUserDto {
  @ApiPropertyOptional({
    enum: ["uk", "en"],
    description: "Locale for verification and welcome emails",
  })
  @IsOptional()
  @IsIn(["uk", "en"])
  locale?: "uk" | "en";
}
