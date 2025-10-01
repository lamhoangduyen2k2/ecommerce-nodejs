"use strict"

import keyTokenModel from "../models/keytoken.model.js"

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = keyTokenModel.create({ user: userId, publicKey: publicKeyString })

            return tokens ? publicKeyString : null
        } catch (error) {
            return error
        }
    }
}

export default KeyTokenService