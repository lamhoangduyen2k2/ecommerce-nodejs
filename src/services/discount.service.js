import { BadRequestError, NotFoundError } from "../core/error.response.js"
import discount from "../models/discount.model.js"
import { convertToObjectIdMongodb } from "../utils/index.js"
import { findAllProducts } from "../models/repositories/product.repo.js"
import { checkDiscountExist, findAllDiscountCodeSelect, findAllDiscountCodeUnSelect } from "../models/repositories/discount.repo.js"


class DiscountService {
    static createDiscountCode = async (payload) => {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, users_used, max_uses, uses_count, max_uses_per_user
        } = payload

        if (new Date(start_date) >= new Date(end_date))
            throw new BadRequestError("Start date must be before end date!")

        const foundDiscount = await checkDiscountExist({ 
            model: discount, 
            filter: { 
                discount_code: code, 
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (foundDiscount && foundDiscount.discount_is_active) 
            throw new BadRequestError("Discount exist!")

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_max_value: max_value,
            discount_min_order_value: min_order_value || 0,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'specific' ? product_ids : []
        })

        return newDiscount;
    }

    static updateDiscountCode = async (payload) => {}

    /**
     * Get all discount codes available with products
     * @param {object} params
     * @param {string} params.code 
     * @param {string} params.shopId 
     * @param {string} params.userId 
     * @param {number} params.limit 
     * @param {number} params.page
     * @returns {Promise<Array<object>>} A promise that resolves to a list of products applicable for the discount.
     */
    static getAllDiscountCodeWithProduct = async ({ code, shopId, userId, limit, page }) => {
        // Create index for discount_code
        const foundDiscount = await checkDiscountExist({ 
            model: discount, 
            filter: { 
                discount_code: code, 
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount || !foundDiscount.discount_is_active)
            throw new NotFoundError("Discount not exist!")

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products;
    }

    /**
     * Get all discount list of shop
     * @param {object} params 
     * @param {number} params.limit 
     * @param {number} params.page 
     * @param {string} params.shopId 
     * @returns {Promise<Array<object>>}
     */
    static getAllDiscountCodesByShop = async ({ limit, page, shopId }) => {
        const discounts = await findAllDiscountCodeSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            select: ['discount_shopId', 'discount_name'],
            model: discount
        })

        return discounts;
    }

    /**
     * Calculate amount of discount value
     * @param {object} params
     * @param {string} params.codeId - The discount code.
     * @param {string} params.userId - The ID of the user.
     * @param {string} params.shopId - The ID of the shop.
     * @param {Array<{productId: string, quantity: number, price: number}>} params.products - List of products in the order.
     * @returns {Promise<{totalOrder: number, discount: number, totalPrice: number}>}
     */
    static getDiscountAmount = async ({ codeId, userId, shopId, products }) => {
        const foundDiscount = await checkDiscountExist({ 
            model: discount, 
            filter: { 
                discount_code: codeId, 
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`)

        const { discount_is_active, 
                discount_max_uses, 
                discount_min_order_value,
                discount_end_date,
                discount_max_uses_per_user,
                discount_users_used,
                discount_type,
                discount_value,
                discount_applies_to,
                discount_product_ids
            } = foundDiscount;

        if (!discount_is_active) throw new NotFoundError('Discount expired!');
        if (!discount_max_uses) throw new NotFoundError('Discount are out!');

        if (new Date() > new Date(discount_end_date))
            throw new NotFoundError('Discount code has expired!');

        let totalOrder = products.reduce((acc, product) => {
            return acc + (product.quantity * product.price)
        }, 0)

        if (discount_min_order_value > 0) {
            let totalOrderForDiscount = 0
            if (discount_applies_to === 'specific') {
                totalOrderForDiscount = products.reduce((acc, product) => {
                    return discount_product_ids.includes(product.productId) ? acc + (product.quantity * product.price) : acc
                }, 0)
            } else {
                totalOrderForDiscount = totalOrder
            }
            if (totalOrderForDiscount < discount_min_order_value) 
                throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}!`)
        }

        if (discount_max_uses_per_user > 0) {
            const userUsedDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUsedDiscount)
                throw new NotFoundError('User already used discount code!')
        }

        let amount = 0;
        if (discount_type === 'fixed') {
            amount = discount_value
        } else {
            let totalOrderForDiscount = totalOrder;
            if (discount_applies_to === 'specific') {
                totalOrderForDiscount = products.filter(p => discount_product_ids.includes(p.productId)).reduce((acc, product) => acc + (product.quantity * product.price), 0)
            }
            amount = totalOrderForDiscount * (discount_value / 100)
        }

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }
 
    static deleteDiscountCode = async ({ shopId, codeId }) => {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted;
    }

    static cancleDiscountCode = async ({ codeId, userId, shopId }) => {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`)

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result;
    }
}

export default DiscountService;