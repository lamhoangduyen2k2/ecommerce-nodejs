"use strict";

import apiKeyModel from "../models/apiKey.model.js";

export const findById = async (key) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};
