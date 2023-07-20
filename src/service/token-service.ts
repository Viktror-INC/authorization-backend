import * as jwt from "jsonwebtoken";
import tokenModel from "../models/token-model";
import ApiError from "../exceprions/api-error";
import UserDto from "../dtos/user-dto";

class TokenService {
  generateTokens(userDto: UserDto) {
    const accessToken = jwt.sign(userDto, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(userDto, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const foundToken = await tokenModel.findOne({ user: userId });

    if (foundToken) {
      foundToken.refreshToken = refreshToken;
      return foundToken.save();
    }

    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async clearToken(refreshToken) {
    const foundToken = await tokenModel.deleteOne({ refreshToken });

    return foundToken;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
      return userData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    try {
      const userData = await tokenModel.findOne({ refreshToken });
      return userData
    } catch (error) {
      console.log("error", error);
    }
  }

}

export default new TokenService();
