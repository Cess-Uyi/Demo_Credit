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

      // check that amount is not less than 1
      if (amount < 1) {
        return errorResponse(res, 400, "amount must be greater than 0", null);
      }
      //check that amount is a number
      if (isNaN(amount)) {
        return errorResponse(res, 400, "amount must be a number", null);
      }

      //fetch previous balance
      let prevBalance = await db
        .select("balance")
        .from("wallets")
        .where({ user_id: user.id });

      //check if user has a wallet
      if (prevBalance.length == 0) {
        return errorResponse(res, 404, "invalid wallet", null);
      }

      //convert balance from string to number
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
            .then((wallet) => {
              return JSON.parse(JSON.stringify(wallet[0]));
            });
        });

      return successResponse(res, 200, "wallet successfully funded", {
        transactionDetails: {
          prevBalance: prevBalance,
          amount: amount,
          newBalance: newBalance,
        },
        updatedWallet,
      });
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }

  static async withdraw(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "validation error", errors.mapped());
    }

    try {
      //get user from the token being used
      const user = req.user;
      const amount = Number(req.body.amount);

      // check that amount is not less than 1
      if (amount < 1) {
        return errorResponse(res, 400, "amount must be greater than 0", null);
      }
      //check that amount is a number
      if (isNaN(amount)) {
        return errorResponse(res, 400, "amount must be a number", null);
      }

      //fetch previous balance
      let prevBalance = await db
        .select("balance")
        .from("wallets")
        .where({ user_id: user.id });

      //check if user has a wallet
      if (prevBalance.length == 0) {
        return errorResponse(res, 404, "invalid wallet", null);
      }

      // convert balance from string to number
      prevBalance = Number(prevBalance[0].balance);

      //check that the amount to be withdrawn is not greater than balance
      if (amount > prevBalance) {
        return errorResponse(res, 400, "insufficient balance", null);
      }

      var newBalance = prevBalance - amount;
      newBalance = +newBalance;

      //save to db
      const updatedWallet = await db("wallets")
        .where({ user_id: user.id })
        .update({
          balance: newBalance,
          updated_at: dateTime(),
        })
        .then((id) => {
          return db("wallets")
            .where({ id })
            .then((wallet) => {
              return JSON.parse(JSON.stringify(wallet[0]));
            });
        });

      return successResponse(res, 200, "withdraw successful", {
        transactionDetails: {
          prevBalance: prevBalance,
          amount: amount,
          newBalance: newBalance,
        },
        updatedWallet,
      });
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }
}

module.exports = Wallets;
