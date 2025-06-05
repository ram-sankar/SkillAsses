import { Response } from "express";

export const sendSuccess = (res: Response, data = {}, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  error: any = "Internal Server Error",
  statusCode = 500,
) => {
  return res.status(statusCode).json({
    success: false,
    message: error,
  });
};
