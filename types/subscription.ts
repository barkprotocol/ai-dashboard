export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum PaymentErrorCode {
  BAD_WALLET = "BAD_WALLET",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  TRANSFER_FAILED = "TRANSFER_FAILED",
  EXTERNAL_ERROR = "EXTERNAL_ERROR",
  UNKNOWN = "UNKNOWN",
}

export class PaymentError extends Error {
  constructor(
    public code: PaymentErrorCode,
    message: string,
  ) {
    super(message)
    this.name = "PaymentError"
  }
}

