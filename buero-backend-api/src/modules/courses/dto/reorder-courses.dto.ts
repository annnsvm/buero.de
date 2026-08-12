import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";

export class ReorderCourseItemDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  id!: string;

  @ApiProperty({ example: 0, description: "Position in catalog (0 = first)" })
  @IsInt()
  @Min(0)
  order_index!: number;
}

export class ReorderCoursesDto {
  @ApiProperty({ type: [ReorderCourseItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderCourseItemDto)
  items!: ReorderCourseItemDto[];
}
