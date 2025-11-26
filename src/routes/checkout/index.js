"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";
import checkcoutController from "../../controllers/checkout.controller.js";

const checkoutRouter = express.Router();

// get amount a discount
checkoutRouter.post("/amount", asyncHandler(checkcoutController.getDiscountAmount))
checkoutRouter.get("/list_product_code", asyncHandler(checkcoutController.getAllDiscountCodesWithProduct))

// authentication
checkoutRouter.use(authentication);

export default checkoutRouter;