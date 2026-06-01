export interface ErrorDetails {
  attribute: string;
  reason: string;
  path: string;
}

export interface ValidationErrorInput {
  code?: number;
  details?: ErrorDetails[];
  message?: string;
  name?: string;
  redirectTo?: string;
}

export class HttpValidationError extends Error {
  code: number;
  details: ErrorDetails[];
  redirectTo: string;

  constructor({ message = '', code = 0, details = [], name = '', redirectTo = '' }: ValidationErrorInput) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = name;
    this.redirectTo = redirectTo;
  }
}
