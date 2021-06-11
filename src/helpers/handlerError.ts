export class CustomError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);

    this.message = message;
    this.status = status;
  }
}
