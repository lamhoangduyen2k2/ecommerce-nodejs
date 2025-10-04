"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
import { asyncHandler } from "../../auth/checkAuth.js";
const accessRouter = express.Router();

// Signup
accessRouter.post("/shop/signup", asyncHandler(accessController.signUp));

export default accessRouter;
