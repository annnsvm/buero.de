import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

/**
 * Тимчасове отримання userId до підключення Auth.
 * Джерело: query.userId, body.userId, заголовок x-user-id.
 * Після підключення авторизації — брати з request.user.id та додати Swagger @ApiBearerAuth('access_token').
 */
export function getUserIdFromRequest(req: Request): string {
  const fromQuery = req.query?.userId;
  const fromBody = (req as Request & { body?: { userId?: string } }).body?.userId;
  const fromHeader = req.headers['x-user-id'];
  const userId = (fromQuery as string) ?? fromBody ?? (Array.isArray(fromHeader) ? fromHeader[0] : fromHeader);
  if (!userId || typeof userId !== 'string') {
    throw new BadRequestException(
      'userId потрібен: передай query userId=, body.userId або заголовок x-user-id (після підключення Auth буде з request.user)',
    );
  }
  return userId;
}
