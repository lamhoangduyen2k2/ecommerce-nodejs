'use strict'

import { model, Schema } from "mongoose"

const DOCUMENT_NAME = "Order"
const COLLECTION_NAME = "orders"

const orderSchema = new Schema(
    {
        order_userId: { type: Number, required: true },
        order_checkout: { type: Object, default: {} },
        order_shipping: { type: Object, default: {} },
        order_payment: { type: Object, default: {} },
        order_products: { type: Array, required: true },
        order_trackingNumber: { type: String, default: '#0000112122025' },
        order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancled', 'delivered'], default: 'pending'}
    },
    {
        collection: COLLECTION_NAME,
        timestamps: {
            createdAt: 'createdOn',
            updatedAt: 'modifiedOn'
        } 
    }
);

export default model(DOCUMENT_NAME, orderSchema);

