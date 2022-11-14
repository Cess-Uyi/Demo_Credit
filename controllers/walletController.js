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

      let newBalance = (prevBalance + amount).toString();

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

      let newBalance = (prevBalance - amount).toString();

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

  static async transfer(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "validation error", errors.mapped());
    }
    try {
      const user = req.user;
      const { amount, recipientId, recipientEmail } = req.body;

      // check that either recipientId or recipient email is provided
      if (!recipientId && !recipientEmail) {
        return errorResponse(
          res,
          400,
          "recipientId or recipientEmail must be provided",
          null
        );
      }

      // if recipientId and recipient email is provided, check that they belong to the same user
      if (recipientId && recipientEmail) {
        let userById = await db
          .select("id")
          .from("users")
          .where({ id: recipientId });
        userById = JSON.parse(JSON.stringify(userById[0]));

        let userByEmail = await db
          .select("id")
          .from("users")
          .where({ email: recipientEmail });
        userByEmail = JSON.parse(JSON.stringify(userByEmail[0]));

        if (userById.id != userByEmail.id) {
          return errorResponse(
            res,
            400,
            "conflicting users. Kindly check the data being inputted",
            null
          );
        }
      }

      // Get recipientId
      if (recipientId) {
        var verifiedRecipient = await db
          .select("*")
          .from("users")
          .where({ id: recipientId });
      } else {
        var verifiedRecipient = await db
          .select("*")
          .from("users")
          .where({ email: recipientEmail });
      }
      verifiedRecipient = JSON.parse(JSON.stringify(verifiedRecipient[0]));

      //fetch previous balance for user signed in
      let userPrevBalance = await db
        .select("balance")
        .from("wallets")
        .where({ user_id: user.id });

      // convert balance from string to number
      userPrevBalance = Number(userPrevBalance[0].balance);

      //fetch previous balance for recipient
      let recipientPrevBalance = await db
        .select("balance")
        .from("wallets")
        .where({ user_id: verifiedRecipient.id });

      // convert balance from string to number
      recipientPrevBalance = Number(recipientPrevBalance[0].balance);

      //check that the amount to be transferred is not greater than balance
      if (amount > userPrevBalance) {
        return errorResponse(res, 400, "insufficient balance", null);
      }

      const userNewBalance = (userPrevBalance - amount).toString();

      const recipientNewBalance = (
        recipientPrevBalance + Number(amount)
      ).toString();

      //make transactions to the db
      await db.transaction(async (trx) => {
        const [updatedUser, updatedRecipient] = await Promise.all([
          trx("wallets")
            .where({ user_id: user.id })
            .update({ balance: userNewBalance, updated_at: dateTime() })
            .transacting(trx),
          trx("wallets")
            .where({ user_id: verifiedRecipient.id })
            .update({ balance: recipientNewBalance, updated_at: dateTime() })
            .transacting(trx),
        ]);
      });

      return successResponse(res, 200, "transfer successful", {
        transactionDetails: {
          prevBalance: userPrevBalance,
          amount: amount,
          newBalance: userNewBalance,
        }
      });
    } catch (err) {
      console.log(err);
      errorResponse(res, 500, "internal server error", err.message);
    }
  }
}

module.exports = Wallets;
