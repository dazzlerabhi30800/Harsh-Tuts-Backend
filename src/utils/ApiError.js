class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: any;
  constructor(message: string, statusCode: number, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = this.errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
