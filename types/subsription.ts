export enum PaymentStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

export interface SubscriptionPayment {
  id: string
  paymentDate: Date
  amount: number
  status: PaymentStatus
  transactionHash?: string
  failureReason?: string
}

