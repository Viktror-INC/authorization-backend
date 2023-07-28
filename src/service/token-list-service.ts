import CoinListModel from "../models/token-list-model";

class CoinListService {
  async getCoinListService() {
    const coinList = CoinListModel.find();
    console.log("coinList", coinList);
    return coinList;
  }
}

export default new CoinListService();
