export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
  ) {
    super();
    this.status = status;
  }
}
