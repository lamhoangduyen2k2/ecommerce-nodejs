import { Types } from "mongoose"
import inventory from "../inventory.model.js"

export const insertInventory = async ({ productId, shopId, stock, location = "unKnow" }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location
    })
}