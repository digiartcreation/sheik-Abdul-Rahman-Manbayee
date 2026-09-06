export class AppError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") { super(401, message); }
}
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") { super(403, message); }
}
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") { super(404, message); }
}
export class ConflictError extends AppError {
  constructor(message) { super(409, message); }
}
export class BusinessError extends AppError {
  constructor(message) { super(422, message); }
}
