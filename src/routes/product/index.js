"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";
import productController from "../../controllers/product.controller.js";

const productRouter = express.Router();

// Search api
productRouter.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct))
productRouter.get("", asyncHandler(productController.findAllProducts))
productRouter.get("/:product_id", asyncHandler(productController.findProduct))

// authentication
productRouter.use(authentication);
productRouter.post("", asyncHandler(productController.createProduct));
productRouter.post("/publish/:id", asyncHandler(productController.publishProductByShop));
productRouter.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop));

// QUERY //
productRouter.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop))
productRouter.get("/published/all", asyncHandler(productController.getAllPublishForShop))

export default productRouter;