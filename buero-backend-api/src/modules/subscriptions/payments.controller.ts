import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PaymentResponseDto } from "./dto/payment-response.dto";
import { PaymentService } from "./payment.service";

@ApiTags("payments")
@Controller("payments")
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get("me")
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Історія платежів",
    description: "Список платежів/інвойсів поточного користувача (з course_id).",
  })
  @ApiResponse({
    status: 200,
    description: "Масив платежів",
    type: [PaymentResponseDto],
  })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  async getMyPayments(@Req() req: Request): Promise<PaymentResponseDto[]> {
    return this.paymentService.getMyPayments(req.user!.id);
  }
}
