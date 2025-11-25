'use strict'

import { NotFoundError } from "../core/error.response.js"
import { createUserCart, findUserCart, updateCart, updateUserCartQuantity } from "../models/repositories/cart.repo.js"
import { getProductById } from "../models/repositories/product.repo.js"

/**
 * Key features: Cart Service
 * - add product to cart [User]
 * - reduce product quantity [User]
 * - increase product quantity [User]
 * - get list to Cart [User]
 * - delete cart [User]
 * - delete cart item [User]
*/
class CartService {
    static addToCart = async ({ userId, product = {} }) => {
        const userCart = await findUserCart({ cart_userId: userId })
        if (!userCart) {
            return await createUserCart({ userId, product })
        }

        // If cart exist but doesn't have products
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // If cart exist and has products
        return await updateUserCartQuantity({ userId, product })
    }

    static addToCartV2 = async ({ userId, shop_order_ids = [] }) => {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        const foundShop = await getProductById({ productId })
        if (!foundShop) throw new NotFoundError(`Product doesn't exist!`)

        if (foundShop.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product does not belong to the shop')
        }

        if (quantity === 0) {
            return await this.deleteUserCart({ userId, productId })
        }

        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static deleteUserCart = async ({ userId, productId }) => {
        const query = { cart_userId: userId, cart_state: 'active' },
        updateSet = {
            $pull: {
                cart_products: { productId }
            }
        }

        const deletedCart = await updateCart({ query, update: updateSet })

        return deletedCart;
    }

    static getListUserCart = async ({ userId }) => {
        const query = { cart_userId: +userId }
        return await findUserCart({ query })
    }
}

export default CartService;