const db = require("../db/db");
const dateTime = require("../handler/middlewares/getDateAndTime");

const { validationResult } = require("express-validator");
const { errorResponse, successResponse } = require("../handler/response");

class Wallets {
  static async fund(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "validation error", errors.mapped());
    }

    try {
      //get user from the token being used
      const user = req.user;
      const amount = Number(req.body.amount);

      //fetch previous balance
      let prevBalance = await db
        .select("balance")
        .from("wallets")
        .where({ user_id: user.id });

      if (prevBalance.length == 0) {
        return errorResponse(res, 404, "invalid wallet", null);
      }

      prevBalance = Number(prevBalance[0].balance);
      var newBalance = prevBalance + amount;
      newBalance = +newBalance;

      // save to db
      const updatedWallet = await db("wallets")
        .where({ user_id: user.id })
        .update({
          balance: newBalance,
          updated_at: dateTime(),
        })
        .then((id) => {
          return db("wallets")
            .where({ id })
            .fetch({ withRelated: ["users"], require: true })
            .then((wallet) => {
              return JSON.parse(JSON.stringify(wallet[0]));
            });
        });

      return successResponse(res, 200, "this works", updatedWallet);
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }
}

module.exports = Wallets;
