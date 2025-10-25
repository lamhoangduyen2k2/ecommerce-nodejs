"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { authentication } from "../../auth/authUtils.js";

const accessRouter = express.Router();

// Signup
accessRouter.post("/shop/signup", asyncHandler(accessController.signUp));
accessRouter.post("/shop/login", asyncHandler(accessController.login));


// authentication
accessRouter.use(authentication);
accessRouter.post("/shop/logout", asyncHandler(accessController.logout));
accessRouter.post("/shop/handlerRefreshToken", asyncHandler(accessController.handlerRefreshToken));

export default accessRouter;
