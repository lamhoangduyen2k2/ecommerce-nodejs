"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";
import cartController from "../../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("", asyncHandler(cartController.addToCart))
cartRouter.delete("", asyncHandler(cartController.delete))
cartRouter.post("/update", asyncHandler(cartController.update))
cartRouter.get("", asyncHandler(cartController.listToCart))

export default cartRouter;