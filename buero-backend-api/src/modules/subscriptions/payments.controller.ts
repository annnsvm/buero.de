import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PaymentResponseDto } from "./dto/payment-response.dto";
import { PaymentService } from "./payment.service";

@ApiTags("payments")
@Controller("payments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get("me")
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
  async getMyPayments(@CurrentUser("id") userId: string): Promise<PaymentResponseDto[]> {
    return this.paymentService.getMyPayments(userId);
  }
}
