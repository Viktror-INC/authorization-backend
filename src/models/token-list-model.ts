import { Schema, model } from "mongoose";

const CoinListSchema = new Schema({
  list: [],
});

const CoinListModel = model("CoinList", CoinListSchema);

export default CoinListModel;
