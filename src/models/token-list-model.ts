import { Schema, model } from "mongoose";

const SubTokenListSchema = new Schema({
    name: String,
    age: Number,
  });
  
  const TokenListSchema = new Schema({
    list: [SubTokenListSchema],
  })


const TokenListModel = model("TokenList", TokenListSchema);

export default TokenListModel;