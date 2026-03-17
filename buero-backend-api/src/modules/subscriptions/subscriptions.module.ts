import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { PaymentService } from "./payment.service";
import { PaymentsController } from "./payments.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [
    SubscriptionsController,
    PaymentsController,
    WebhookController,
  ],
  providers: [SubscriptionsService, PaymentService, WebhookService],
  exports: [SubscriptionsService, PaymentService],
})
export class SubscriptionsModule {}
