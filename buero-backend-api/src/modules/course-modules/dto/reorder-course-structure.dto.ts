import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";

export class ReorderStructureMaterialDto {
  @ApiProperty({ format: "uuid", description: "Material id" })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: 0,
    description: "Position inside the target module (0 = first)",
  })
  @IsInt()
  @Min(0)
  order_index!: number;
}

export class ReorderStructureModuleDto {
  @ApiProperty({ format: "uuid", description: "Module id" })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: 0,
    description: "Position inside the course (0 = first)",
  })
  @IsInt()
  @Min(0)
  order_index!: number;

  @ApiPropertyOptional({
    type: [ReorderStructureMaterialDto],
    description:
      "Materials that belong to this module after the move, in display order. Omit to leave the module content untouched.",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderStructureMaterialDto)
  materials?: ReorderStructureMaterialDto[];
}

export class ReorderCourseStructureDto {
  @ApiProperty({
    type: [ReorderStructureModuleDto],
    description: "Full course structure in display order",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderStructureModuleDto)
  modules!: ReorderStructureModuleDto[];
}
