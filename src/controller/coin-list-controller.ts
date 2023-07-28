import { IRequest } from "./user-controller";
import { NextFunction, Response } from "express";
import CoinListService from "../service/token-list-service";

class CoinListController {
  async getCoinList(
    request: IRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const CoinList = await CoinListService.getCoinListService();
      console.log("CoinList", CoinList);
      return response.json(CoinList);
    } catch {}
  }
}

export default new CoinListController();
