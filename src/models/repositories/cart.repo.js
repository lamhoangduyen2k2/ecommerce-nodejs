import { convertToObjectIdMongodb } from "../../utils/index.js"
import cart from "../cart.model.js"

export const findUserCart = async ({ query }) => await cart.findOne(query)

export const findOneAndUpdateUserCart = async ({ query, update, options }) => await cart.findOneAndUpdate(query, update, options)

export const createUserCart  = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateOrInsert = {
        $addToSet: {
            cart_products: product,
        }
    }, 
    options = { upsert: true, new: true }

    return await findOneAndUpdateUserCart({ query, update: updateOrInsert, options })
}

export const updateUserCartQuantity  = async ({ userId, product }) => {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    }, 
    updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }, 
    options = { upsert: true, new: true }

    return await findOneAndUpdateUserCart({ query, update: updateSet, options })
}

export const updateCart = async ({ query, update }) => await cart.updateOne(query, update)

export const findCartById = async ({ cartId }) => await cart.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: 'active' }).lean()