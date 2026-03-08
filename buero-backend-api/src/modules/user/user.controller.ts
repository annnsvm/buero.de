import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
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
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Поточний профіль",
    description:
      "Повертає поточного user + профіль (student_profiles або teacher_profiles) за роллю. Без password_hash.",
  })
  @ApiResponse({ status: 200, description: "User та профіль" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  async getMe(@Req() req: Request) {
    const profile = await this.userService.getProfile(req.user!.id);
    if (!profile) throw new NotFoundException("Profile not found");
    return profile;
  }

  @Patch("me")
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Оновити профіль",
    description:
      "Student: timezone, language. Teacher: bio, is_active. Level не змінюється.",
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: "Оновлений профіль" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 404, description: "User не знайдено" })
  async updateMe(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const result = await this.userService.updateProfile(req.user!.id, dto);
    if (!result) throw new NotFoundException("User not found");
    return result;
  }
}
