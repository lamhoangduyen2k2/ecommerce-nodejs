'use strict'

import { BadRequestError } from "../core/error.response.js";
import inventory from "../models/inventory.model.js";
import { getProductById } from "../models/repositories/product.repo.js";

class InventoryService {
    static addStockInventory = async ({ stock, productId, shopId, location = '134, Tran Phu, HCM city' }) => {
        const product = await getProductById({ productId })
        if (!product) throw new BadRequestError('The product does not exists!')

        const query = { inven_shopId: shopId, inven_productId: productId },
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        },
        options = { upsert: true, new: true }

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

export default InventoryService; 