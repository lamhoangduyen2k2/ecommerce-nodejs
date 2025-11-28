"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import checkcoutController from "../../controllers/checkout.controller.js";

const checkoutRouter = express.Router();

checkoutRouter.post("/review", asyncHandler(checkcoutController.checkoutReview))


export default checkoutRouter;