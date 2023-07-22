import dayjs = require("dayjs");
import UserService from "../service/user-service";
import { validationResult } from "express-validator";
import ApiError from "../exceprions/api-error";
import { CookieOptions, NextFunction } from "express";
import { Request, Response } from "express";
import UserModel from "../models/user-model";

interface Tokens {
  key: string;
  value: string;
  date: Date;
  httpOnly?: boolean;
}

export interface IRequest extends Request {
  headers: { authorization: string };
  cookies: CookieOptions & { refreshToken: string; accessToken: string };
  user?: typeof UserModel;
}

const setCookies = (tokens: Tokens[], response) => {
  tokens.forEach((token) => {
    response.cookie(token.key, token.value, {
      maxAge: token.date,
      httpOnly: token.httpOnly || true,
      sameSite: 'none',
      domain: 'https://authorization-frontend.vercel.app/'
    });
  });
};

const tokens = (userData) => [
  {
    key: "refreshToken",
    value: userData.refreshToken,
    date: dayjs().add(30, "days").toDate(),
  },
  {
    key: "accessToken",
    value: userData.accessToken,
    date: dayjs().add(30, "minute").toDate(),
  },
];

class UserController {
  async registration(
    request: IRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        next(ApiError.BadRequest("validation error", errors.array()));
      }

      const { email, password } = await request.body;
      const userData = await UserService.registrationService(email, password);

      //set cookie from server
      setCookies(tokens(userData), response);

      return response.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(request: IRequest, response: Response, next: NextFunction) {
    try {
      const { email, password } = await request.body;
      const userData = await UserService.loginService(email, password);

      //set cookie from server
      setCookies(tokens(userData), response);

      return response.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logOut(request: IRequest, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.cookies;
      const token = UserService.logOutService(refreshToken);
      response.clearCookie("refreshToken");
      response.clearCookie("accessToken");

      return response.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activate(request: IRequest, response: Response, next: NextFunction) {
    try {
      const activationLink = request.params.link;
      UserService.activateService(activationLink);
      return response.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refresh(request: IRequest, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.cookies;

      const userData = await UserService.refreshService(refreshToken);

      // set cookie from server
      setCookies(tokens(userData), response);

      return response.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(request: IRequest, response: Response, next: NextFunction) {
    try {
      const { refreshToken } = request.cookies;
      const users = await UserService.getUsersService(refreshToken);
      response.json(users);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
