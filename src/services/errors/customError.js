export default class customError {
  static createError({ name = "Error", cause, message, code = 1 }) {
    const error = new Error(message);
    error.name = name;
    error.code = code;
    Error.captureStackTrace(error, customError.createError);
    error.cause = cause;
    throw error;
  }
}
