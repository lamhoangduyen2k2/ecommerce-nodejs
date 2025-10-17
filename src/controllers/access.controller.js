"use strict";

import { CREATED } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

export default new AccessController();
