"use strict";

class AccessService {
  static signUp = async () => {
    try {
        
    } catch (error) {
      return {
        code: "XXX",
        message: error.message,
        status: "error",
      };
    }
  };
}

export default AccessService;
