import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID } from "class-validator";
import { Role } from "src/generated/prisma/enums";

/**
 * Тимчасова ідентифікація користувача (до підключення JWT у окремій таскі).
 * Передавати query: userId, role (student | teacher).
 */
export class LessonRequestActorQueryDto {
  @ApiProperty({
    format: "uuid",
    description: "ID користувача (після Auth — з токена)",
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({ enum: Role, description: "Роль для логіки списку та дій" })
  @IsEnum(Role)
  role!: Role;
}
