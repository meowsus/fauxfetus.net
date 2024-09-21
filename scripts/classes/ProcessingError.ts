class ProcessingError extends Error {
  constructor(message: string | string[]) {
    super(typeof message === "string" ? message : message.join(", "));
  }
}
