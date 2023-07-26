import TokenListModel from "../models/token-list-model"

class TokenListService {
    async getTokenListService() {
         const tokenList = TokenListModel.find()
        return tokenList
     }
}

export default new TokenListService()