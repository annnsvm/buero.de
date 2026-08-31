import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "src/generated/prisma/enums";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CourseModuleService } from "./course-module.service";
import { ReorderCourseStructureDto } from "./dto/reorder-course-structure.dto";

@ApiTags("course-modules")
@Controller("courses/:courseId/structure")
export class CourseStructureController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Reorder course structure",
    description:
      "Teacher only. Persists module order and, for every listed material, its position and owning module. Moving a material between modules is supported.",
  })
  @ApiParam({ name: "courseId", description: "Course UUID" })
  @ApiBody({ type: ReorderCourseStructureDto })
  @ApiResponse({ status: 200, description: "Updated course structure" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Teachers only" })
  @ApiResponse({
    status: 404,
    description: "Course, module or material not found",
  })
  reorder(
    @Param("courseId") courseId: string,
    @Body() dto: ReorderCourseStructureDto
  ) {
    return this.courseModuleService.reorderStructure(courseId, dto);
  }
}
