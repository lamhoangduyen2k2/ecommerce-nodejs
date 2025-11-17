import { BadRequestError } from "../core/error.response.js"
import discount from "../models/discount.model.js"
import { convertToObjectIdMongodb } from "../utils"

class DiscountService {
    static createDiscountCode = async (payload) => {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user
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
        })
    }
}

export default DiscountService;