class ApiError extends Error {
  constructor(message, statusCode, errors = [], stack = "") {
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
