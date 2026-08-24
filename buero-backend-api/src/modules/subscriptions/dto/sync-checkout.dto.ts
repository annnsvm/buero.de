import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SyncCheckoutDto {
  @ApiProperty({
    description: "orderReference, який повернув WayForPay",
    example: "bd-1755600000000-1a2b3c4d",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  order_reference!: string;
}
