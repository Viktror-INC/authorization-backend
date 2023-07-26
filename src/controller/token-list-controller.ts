import { IRequest } from "./user-controller";
import { NextFunction, Response } from "express";
import TokenListService from "../service/token-list-service";

class TokenListController {
  async getTokenList(
    request: IRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const tokenList = await TokenListService.getTokenListService();
      console.log("tokenList", tokenList);
      return response.json(tokenList);
    } catch {}
  }
}

export default new TokenListController();
