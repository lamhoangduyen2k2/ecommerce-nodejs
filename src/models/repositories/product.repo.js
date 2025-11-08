'use strict'

import { product, clothing, electronic, furniture } from "../product.model.js"

export const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product.find(query)
                        .populate('product_shop', 'name email -_id')
                        .sort({ updateAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .lean()
                        .exec();
}