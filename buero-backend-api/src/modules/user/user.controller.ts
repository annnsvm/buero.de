import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-user.dto";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @ApiOperation({
    summary: "Поточний профіль",
    description:
      "Повертає поточного user + профіль (student_profiles або teacher_profiles) за роллю. Без password_hash.",
  })
  @ApiResponse({ status: 200, description: "User та профіль" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  async getMe(@CurrentUser("id") userId: string) {
    const profile = await this.userService.getProfile(userId);
    if (!profile) throw new NotFoundException("Profile not found");
    return profile;
  }

  @Patch("me")
  @ApiOperation({
    summary: "Оновити профіль",
    description:
      "Student: timezone, language. Teacher: bio, is_active. Level не змінюється.",
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: "Оновлений профіль" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 404, description: "User не знайдено" })
  async updateMe(@CurrentUser("id") userId: string, @Body() dto: UpdateProfileDto) {
    const result = await this.userService.updateProfile(userId, dto);
    if (!result) throw new NotFoundException("User not found");
    return result;
  }
}
