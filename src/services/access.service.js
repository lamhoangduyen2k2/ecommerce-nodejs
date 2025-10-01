"use strict";

import bcrypt from "bcrypt"
import crypto from "crypto"
import shopModel from "../models/shop.model.js";
import KeyTokenService from "./keyToken.service.js";

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
        const newShop = await shopModel.create({ name, email, passwordHash, roles: [RoleShop.SHOP] })

        if (newShop) {
          // created privateKey, publicKey
          const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 4096
          })

          console.log(`🚀 ~ AccessService ~ { privateKey, publicKey }:`, { privateKey, publicKey }) // save collection KeyStore

          const publicKeyString = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey })

          if (!publicKeyString) return {
          code: "XXXX",
          message: "publicKeyString error",
        }

        // const tokens = await
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
