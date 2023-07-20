import UserModel from "../models/user-model";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import MailService from "./mail-service";
import TokenService from "./token-service";
import UserDto from "../dtos/user-dto";
import ApiError from "../exceprions/api-error";
import TokenModel from "../models/token-model";

const checkUser = async(refreshToken) => {
  if (!refreshToken) {
    throw ApiError.NotAuthorizeErr();
  }

  // decode token, but data in token can be old
  const userData = TokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await TokenService.findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.NotAuthorizeErr();
  }

  // get actual data from user model table
  const user = UserModel.findOne({ _id: userData.id });

  if (!user) {
    throw ApiError.NotAuthorizeErr();
  }

  return {user, userData, tokenFromDb}
}

class UserService {
  async registrationService(email, password) {
    const user = await UserModel.findOne({ email });

    if (user) {
      throw ApiError.BadRequest(`Email ${email} registered`);
    }

    // hidden password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    // create activation link for email
    const activationLink = uuidv4();

    //send message for activation
    await MailService.sendACtivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    // save user to database
    const newUser = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    const userDto = new UserDto(newUser);

    //generate tokens
    const tokens = TokenService.generateTokens({ ...userDto });

    //save tokens to database
    TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activateService(activationLink) {
    try {
      const user = await UserModel.findOne({ activationLink });

      if (!user) {
        throw ApiError.BadRequest("user link not found");
      }

      user.isActivated = true;
      user.save();
    } catch (error) {
      throw ApiError.BadRequest("cant activate account use link", error);
    }
  }

  async loginService(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User ${email} not registered`);
    }

    const isPasswordCorr = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorr) {
      throw ApiError.BadRequest(`Password ${email} not correct`);
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    TokenService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logOutService(refreshToken) {
    return await TokenService.clearToken(refreshToken);
  }

  async refreshService(refreshToken) {
    const {user} = await checkUser(refreshToken)

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    //save token to database
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return tokens;
  }

  async getUsersService(refreshToken) {
     await checkUser(refreshToken)
      const users = UserModel.find()
     return users
  }
}

export default new UserService();
