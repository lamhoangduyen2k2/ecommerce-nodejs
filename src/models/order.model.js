'use strict'

import { model, Schema } from "mongoose"

const DOCUMENT_NAME = "Order"
const COLLECTION_NAME = "orders"

const orderSchema = new Schema(
    {
        
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

