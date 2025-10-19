"use strict";

<<<<<<< HEAD
import { CREATED } from "../core/success.response.js";
=======
import { CREATED, SuccessResponse } from "../core/success.response.js";
>>>>>>> b58800c7ea9332aadacb2127c90db59b1d155d80
import AccessService from "../services/access.service.js";

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
<<<<<<< HEAD
        limit: 10
=======
        limit: 10,
>>>>>>> b58800c7ea9332aadacb2127c90db59b1d155d80
      },
    }).send(res);
  };
}

export default new AccessController();
