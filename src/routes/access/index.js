"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
const accessRouter = express.Router();

// Signup
accessRouter.post("/shop/signup", accessController.signUp);

export default accessRouter;
