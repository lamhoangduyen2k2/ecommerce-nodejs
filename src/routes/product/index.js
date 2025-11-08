"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";
import productController from "../../controllers/product.controller.js";

const productRouter = express.Router();

// authentication
productRouter.use(authentication);
productRouter.post("", asyncHandler(productController.createProduct));

// QUERY //
productRouter.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop))

export default productRouter;