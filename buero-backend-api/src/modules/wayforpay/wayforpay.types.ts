/** Параметри для створення платіжної сторінки WayForPay (Purchase). */
export type WayForPayPurchaseParams = {
  orderReference: string;
  orderDate: number;
  amount: number;
  currency: string;
  productName: string;
  productPrice: number;
  productCount?: number;
  returnUrl: string;
  serviceUrl: string;
  clientEmail?: string;
  clientAccountId?: string;
  language?: string;
};

/** Тіло запиту, який WayForPay надсилає на serviceUrl. */
export type WayForPayServiceUrlPayload = {
  merchantAccount?: string;
  orderReference?: string;
  merchantSignature?: string;
  amount?: number | string;
  currency?: string;
  authCode?: string;
  cardPan?: string;
  transactionStatus?: string;
  reasonCode?: number | string;
  reason?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
};

/** Відповідь CHECK_STATUS. */
export type WayForPayCheckStatusResponse = {
  orderReference?: string;
  transactionStatus?: string;
  amount?: number | string;
  currency?: string;
  authCode?: string;
  cardPan?: string;
  reasonCode?: number | string;
  reason?: string;
};

/** Відповідь, якої WayForPay очікує від нашого serviceUrl. */
export type WayForPayAcceptResponse = {
  orderReference: string;
  status: "accept";
  time: number;
  signature: string;
};

/** Статуси транзакцій WayForPay. */
export const WAYFORPAY_STATUS = {
  approved: "Approved",
  inProcessing: "InProcessing",
  pending: "Pending",
  waitingAuthComplete: "WaitingAuthComplete",
  declined: "Declined",
  expired: "Expired",
  refunded: "Refunded",
  voided: "Voided",
} as const;
