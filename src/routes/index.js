"use strict";

import express from "express";
// Routes
import accessRouter from "./access/index.js";

const router = express.Router();

// check apiKey
router.use()
// check permissions

router.use("/v1/api", accessRouter);
export default router;
