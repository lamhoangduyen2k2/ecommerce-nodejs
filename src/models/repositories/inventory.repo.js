import inventory from "../inventory.model.js"
import { convertToObjectIdMongodb } from "../../utils/index.js"

export const insertInventory = async ({ productId, shopId, stock, location = "unknow" }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location
    })
}

export const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock: { $gte: quantity }
    }, 
    updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservation: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, 
    options = { upsert: true, new: true }

    return await inventory.updateOne(query, updateSet, options)
}