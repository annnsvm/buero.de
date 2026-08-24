import { Global, Module } from "@nestjs/common";
import { WayForPayService } from "./wayforpay.service";

@Global()
@Module({
  providers: [WayForPayService],
  exports: [WayForPayService],
})
export class WayForPayModule {}
