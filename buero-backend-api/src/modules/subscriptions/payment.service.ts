import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import type { PaymentResponseDto } from "./dto/payment-response.dto";

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyPayments(userId: string): Promise<PaymentResponseDto[]> {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return payments.map((p) => ({
      id: p.id,
      user_id: p.userId,
      course_id: p.courseId ?? undefined,
      subscription_id: p.subscriptionId ?? undefined,
      stripe_invoice_id: p.stripeInvoiceId,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      created_at: p.createdAt,
    }));
  }
}
