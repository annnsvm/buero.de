import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CookieService } from "./cookie.service";
import { UserService } from "../user/user.service";
import { Response, Request } from "express";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly cookieService: CookieService,
    private readonly userService: UserService,
  ) {}

  @Post("register")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Реєстрація",
    description:
      "Створити користувача (user + профіль). Успіх = логін: cookie access_token, refresh_token, тіло { user }. Дублікат email → 409.",
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "Користувача створено, токени в cookie" })
  @ApiResponse({ status: 400, description: "Невалідні дані (email, пароль, role)" })
  @ApiResponse({ status: 409, description: "Email вже зареєстрований" })
  @ApiResponse({ status: 429, description: "Too Many Requests — перевищено ліміт спроб" })
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.createUser(dto);
    const accessToken = this.userService.signAccessToken(user.id);
    const refreshToken = await this.userService.createRefreshToken(user.id);
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    res.status(HttpStatus.CREATED).json({ user });
  }

  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Вхід",
    description: "Перевірка email + password, видача access та refresh у cookie, тіло { user }.",
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Успішний вхід, токени в cookie" })
  @ApiResponse({ status: 401, description: "Невірний email або пароль" })
  @ApiResponse({ status: 429, description: "Too Many Requests — перевищено ліміт спроб" })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.findUserByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const valid = await this.userService.validatePassword(user, dto.password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");
    const accessToken = this.userService.signAccessToken(user.id);
    const refreshToken = await this.userService.createRefreshToken(user.id);
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    const userWithoutPassword = await this.userService.findUserById(user.id);
    if (!userWithoutPassword) throw new UnauthorizedException();
    res.status(HttpStatus.OK).json({ user: userWithoutPassword });
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Оновлення токенів",
    description:
      "Refresh_token з cookie. Ротація: новий access + новий refresh, старий ревокається. Токени тільки в cookie.",
  })
  @ApiResponse({ status: 200, description: "Нові токени в cookie, тіло { user }" })
  @ApiResponse({ status: 401, description: "Відсутній або невалідний refresh token" })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refresh_token;
    if (!token) throw new UnauthorizedException("Refresh token not found");
    const record = await this.userService.findRefreshToken(token);
    if (!record) throw new UnauthorizedException("Invalid refresh token");
    await this.userService.revokeRefreshToken(token);
    const accessToken = this.userService.signAccessToken(record.userId);
    const refreshToken = await this.userService.createRefreshToken(record.userId);
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    const user = await this.userService.findUserById(record.userId);
    if (!user) throw new UnauthorizedException("User not found");
    res.status(HttpStatus.OK).json({ user });
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Вихід",
    description: "Ревок refresh-токена в БД, очищення cookie. 200 з порожнім тілом.",
  })
  @ApiResponse({ status: 200, description: "Вихід виконано" })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refresh_token;
    if (token) await this.userService.revokeRefreshToken(token);
    this.cookieService.clearAuthCookies(res);
    res.status(HttpStatus.OK).send();
  }

  @Post("change-password")
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Зміна пароля",
    description:
      "Потрібен JWT (cookie access_token або Bearer). Перевіряється поточний пароль; усі refresh-токени відкликаються; видаються нові access і refresh у cookie. Тіло { user }.",
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: "Пароль змінено, нові токени в cookie, тіло { user }",
  })
  @ApiResponse({ status: 400, description: "Новий пароль збігається з поточним" })
  @ApiResponse({ status: 401, description: "Невірний поточний пароль або немає JWT" })
  @ApiResponse({ status: 404, description: "Користувач не знайдено" })
  @ApiResponse({ status: 429, description: "Too Many Requests" })
  async changePassword(
    @CurrentUser("id") userId: string,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.changePassword(
      userId,
      dto.current_password,
      dto.new_password,
    );
    const accessToken = this.userService.signAccessToken(user.id);
    const refreshToken = await this.userService.createRefreshToken(user.id);
    this.cookieService.setAuthCookies(res, accessToken, refreshToken);
    res.status(HttpStatus.OK).json({ user });
  }
}
