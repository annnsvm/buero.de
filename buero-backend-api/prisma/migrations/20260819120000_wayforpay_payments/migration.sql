-- Міграція Stripe → WayForPay. Тільки адитивні зміни: старі Stripe-платежі лишаються читабельними.

-- payments: провайдер, orderReference, updated_at
ALTER TABLE "payments" ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE "payments" ALTER COLUMN "provider" SET DEFAULT 'wayforpay';
ALTER TABLE "payments" ADD COLUMN "order_reference" TEXT;
ALTER TABLE "payments" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- WayForPay-платежі не мають Stripe invoice
ALTER TABLE "payments" ALTER COLUMN "stripe_invoice_id" DROP NOT NULL;

CREATE UNIQUE INDEX "payments_order_reference_key" ON "payments"("order_reference");
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- Ідемпотентність callback-ів WayForPay
CREATE TABLE "payment_webhook_events" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'wayforpay',
    "event_key" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_webhook_events_event_key_key" ON "payment_webhook_events"("event_key");
