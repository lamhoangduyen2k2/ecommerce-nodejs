"use strict";

import { findById } from "../services/apiKey.service.js";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

export const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key)
      return res.status(403).json({
        message: "Forbidden error",
      });
    // check objKey
    const objKey = await findById(key);
    if (!objKey)
      return res.status(403).json({
        message: "Forbidden error",
      });
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log("🚀 ~ apiKey ~ error:", error);
  }
};

export const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions)
      return res.status(403).json({
        message: "Permission denied",
      });

    console.log("permission::", req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission)
      return res.status(403).json({
        message: "Permission denied",
      });

    return next();
  };
};
// Try_Catch Function to catch error and throw it to Error Handler
export const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
