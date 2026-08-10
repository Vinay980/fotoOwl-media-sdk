export type MediaErrorCode =
  | "INVALID_API_KEY"
  | "UNAUTHORIZED"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "NETWORK_ERROR"
  | "API_ERROR"
  | "INVALID_REQUEST";

export class MediaError extends Error {
  readonly code: MediaErrorCode;
  readonly status?: number;

  constructor(
    code: MediaErrorCode,
    message: string,
    status?: number
  ) {
    super(message);

    this.name = "MediaError";
    this.code = code;
    this.status = status;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}