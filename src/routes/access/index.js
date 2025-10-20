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
accessRouter.post("/shop/login", asyncHandler(accessController.logout));

export default accessRouter;
