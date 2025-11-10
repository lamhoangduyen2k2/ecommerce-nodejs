'use strict'

import { Types } from "mongoose";
import { product, clothing, electronic, furniture } from "../product.model.js"

export const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

export const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

export const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
                        .populate('product_shop', 'name email -_id')
                        .sort({ updateAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .lean()
                        .exec();
}