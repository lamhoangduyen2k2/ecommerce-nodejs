import { BadRequestError, NotFoundError } from "../core/error.response.js"
import discount from "../models/discount.model.js"
import { convertToObjectIdMongodb } from "../utils"
import { findAllProducts } from "../models/repositories/product.repo.js"

class DiscountService {
    static createDiscountCode = async (payload) => {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, users_used, max_uses, uses_count, max_uses_per_user
        } = payload

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) 
            throw new BadRequestError("Discount code has expired!")

        if (new Date(start_date) > new Date(end_date))
            throw new BadRequestError("Start date must be before end date!")

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        if (foundDiscount && foundDiscount.discount_is_active) 
            throw new BadRequestError("Discount exist!")

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
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
            discount_product_ids: product_ids
        })

        return newDiscount;
    }

    static updateDiscountCode = async (payload) => {}

    /**
     * Get all discount codes available with products
     * @param {String} code 
     * @param {String} shopId 
     * @param {String} userId 
     * @param {Number} limit 
     * @param {Number} page 
     * @returns 
     */
    static getAllDiscountCodeWithProduct = async ({ code, shopId, userId, limit, page }) => {
        // Create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
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

    
}

export default DiscountService;