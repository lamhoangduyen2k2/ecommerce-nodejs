"use strict";

import bcrypt from "bcrypt"
import crypto from "crypto"
import shopModel from "../models/shop.model.js";
import KeyTokenService from "./keyToken.service.js";
import { createTokenPair } from "../auth/authUtils.js";
import { getInfoData } from "../utils/index.js"

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
}

class AccessService {
  static signUp = async ({ name, email, password}) => {
    try {
        // step 1: check email existed??

        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) return {
          code: "XXXX",
          message: "Shop already registered!",
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })

        if (newShop) {
          // created privateKey, publicKey
          const privateKey = crypto.randomBytes(64).toString("hex")
          const publicKey = crypto.randomBytes(64).toString("hex")

          const keyStore = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey, privateKey })

          if (!keyStore) return {
            code: "XXXX",
            message: "keyStore error",
          }

          // create token pair
          const tokens = createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
          console.log(`Created Token success::`, tokens)

          return {
            code: 201,
            metadata: {
              shop: getInfoData({ fields: ["_id", "name", "email"], object: newShop }),
              tokens
            }
          }
        }

        return {
          code: 200,
          metadata: null
        }
    } catch (error) {
      return {
        code: "XXX",
        message: error.message,
        status: "error",
      };
    }
  };
}

export default AccessService;
