'use strict'

import { BadRequestError, NotFoundError } from "../core/error.response.js"
import { findCartById } from "../models/repositories/cart.repo.js"
import { checkProductByServer } from "../models/repositories/product.repo.js"
import DiscountService from "../services/discount.service.js"


class CheckoutService {
    /**
      {
           "cartId",
           "userId",
           "shop_order_ids": [
               {
                  "shopId",
                  "shop_discounts": []
                  "item_products": [
                      {
                          "price",
                          "quantity",
                          "productId"
                      }
                  ]
               },
               {
                  "shopId",
                  "shop_discounts": [
                       {
                           "shopId",
                           "discountId",
                           "codeId",
                       }
                   ]
                  "item_products": [
                      {
                          "price",
                          "quantity",
                          "productId"
                      }
                  ]
               }
           ]
      }
     */
    static checkoutReview = async ({ cartId, userId, shop_order_ids = [] }) => {
        const foundCart = await findCartById({ cartId })
        if (!foundCart) throw new NotFoundError('Cart does not exists!')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0, 
            totalDiscount: 0,
            totalCheckout: 0,
        },
        shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            const checkProductServer = await checkProductByServer(item_products)
            if (!checkProductServer[0]) throw new BadRequestError('Order wrong!!!')

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // checkout_order.totalCheckout += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            if (shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                checkout_order.totalDiscount +=discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            checkout_order.totalPrice += itemCheckout.priceRaw
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static orderByUser = async ({
        shop_order_ids,
        cartId,
        userId,
        user_address,
        user_payment
    }) => {
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // Sử dụng flatMap để làm phẳng object tạo thành một array
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        
    }
}

export default CheckoutService