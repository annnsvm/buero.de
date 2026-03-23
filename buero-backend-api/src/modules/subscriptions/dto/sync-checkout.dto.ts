import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class SyncCheckoutDto {
  @ApiProperty({
    description: "Stripe Checkout Session id (cs_...)",
    example: "cs_test_a1b2c3",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^cs_[a-zA-Z0-9_]+$/, {
    message: "session_id must be a valid Stripe Checkout Session id",
  })
  session_id!: string;
}
