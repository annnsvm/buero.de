import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

const ACCESS_MAX_AGE = 1800; // 30 min
const REFRESH_MAX_AGE = 604800; // 7 days
const COOKIE_PATH = "/api";

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  private getSecure(): boolean {
    return this.configService.get<string>("COOKIE_SECURE") === "true";
  }

  private getDomain(): string | undefined {
    const domain = this.configService.get<string>("COOKIE_DOMAIN");
    return domain?.trim() || undefined;
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    const secure = this.getSecure();
    const domain = this.getDomain();
    const baseOptions = {
      path: COOKIE_PATH,
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      ...(domain && { domain }),
    };
    res.cookie("access_token", accessToken, {
      ...baseOptions,
      maxAge: ACCESS_MAX_AGE * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      ...baseOptions,
      maxAge: REFRESH_MAX_AGE * 1000,
    });
  }

  clearAuthCookies(res: Response): void {
    const secure = this.getSecure();
    const domain = this.getDomain();
    const clearOptions = {
      path: COOKIE_PATH,
      httpOnly: true,
      sameSite: "lax" as const,
      secure,
      maxAge: 0,
      ...(domain && { domain }),
    };
    res.cookie("access_token", "", clearOptions);
    res.cookie("refresh_token", "", clearOptions);
  }
}
