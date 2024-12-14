import { StatusCodes } from "http-status-codes";

const errorHandleware = (err, req, res, next) => {
  console.log(err); // Log the error for debugging (this can be replaced with a logger in production)

  // Get the status code from the error or fallback to 500
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Get the message from the error or provide a default message
  const msg = err.message || "Something went wrong, try again later.";

  res.status(statusCode).json({ msg, errorDetails });
};
export default errorHandleware;
