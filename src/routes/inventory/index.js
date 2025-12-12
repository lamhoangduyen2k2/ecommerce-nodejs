"use strict";

import express from "express";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import inventoryController from "../../controllers/inventory.controller.js";
import { authentication } from "../../auth/authUtils.js"

const inventoryRouter = express.Router();

inventoryRouter.use(authentication)
inventoryRouter.post("", asyncHandler(inventoryController.addStockToInventory))

export default inventoryRouter;