const db = require("../db/db");

const { validationResult } = require("express-validator");
const { errorResponse, successResponse } = require("../handler/response");

class Wallets {
  static async fund(req, res) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return errorResponse(res, 422, "validation error", errors.mapped());
    // }

    try {
      console.log("this works");

      return successResponse(res, 200, "this works", null);
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }
}

module.exports = Wallets;
