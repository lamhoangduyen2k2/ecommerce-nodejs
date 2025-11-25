"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";
import discountController from "../../controllers/discount.controller.js";

const discountRouter = express.Router();

// get amount a discount
discountRouter.post("/amount", asyncHandler(discountController.getDiscountAmount))
discountRouter.get("/list_product_code", asyncHandler(discountController.getAllDiscountCodesWithProduct))

// authentication
discountRouter.use(authentication);

discountRouter.post("", asyncHandler(discountController.createDiscountCode))
discountRouter.get("", asyncHandler(discountController.getAllDiscountCodes))

export default discountRouter;