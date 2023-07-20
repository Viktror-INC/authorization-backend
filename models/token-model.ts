import { Schema, model } from "mongoose";

// which field contain in user
const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "UserModel" },
  refreshToken: { type: String, required: true },
});

const TokenModel = model("TokenModel", TokenSchema);

export default TokenModel;
