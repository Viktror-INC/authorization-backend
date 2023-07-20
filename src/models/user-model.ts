import { Schema, model } from "mongoose";

// which field contain in user
const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
});


const UserModel = model("UserModel", UserSchema);

export default UserModel;
