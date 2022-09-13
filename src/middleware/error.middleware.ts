import { NextFunction, Request, response, Response } from "express";
import HttpException from "exceptions/HttpExceptions";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({ status, message });
}

export default errorMiddleware;