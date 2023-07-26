import { NextFunction } from "express";
import ApiError from "../exceprions/api-error";
import { IRequest } from "../controller/user-controller";
import { Response } from "express";
import tokenService from "../service/token-service";
import UserModel from "../models/user-model";

export const authMiddleware = (
  request: IRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
      return next(ApiError.NotAuthorizeErr());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.NotAuthorizeErr());
    }

    // add to request new field
    request.user = userData as typeof UserModel;
    next();
  } catch (error) {
    return next(ApiError.NotAuthorizeErr());
  }
};
