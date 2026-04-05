import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { Role } from '../../../generated/prisma/enums';

export class LessonRequestActorQueryDto {
  @ApiProperty({ format: 'uuid', description: 'Поточний користувач (тимчасово; після Auth — з JWT)' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ enum: Role, description: 'Роль (тимчасово з query; після Auth — з токена)' })
  @IsEnum(Role)
  role!: Role;
}
