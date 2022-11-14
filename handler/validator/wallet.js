const { body } = require("express-validator");

const db = require("../../db/db");

exports.FUND = [body("amount").isString().trim().notEmpty()];

exports.WITHDRAW = [body("amount").isString().trim().notEmpty()];

exports.TRANSFER = [
  body("amount")
    .isString()
    .trim()
    .notEmpty()
    .custom((value) => {
      if (value <= 0) {
        return Promise.reject("amount must be greater than 0");
      } else {
        return true;
      }
    })
    .custom((value) => {
      if (isNaN(Number(value))) {
        return Promise.reject("amount must be a number");
      } else {
        return true;
      }
    }),
  body("recipientId")
    .isInt()
    .trim()
    .optional()
    .custom((value) => {
      return db
        .select("*")
        .from("users")
        .where({ id: value })
        .then((id) => {
          if (id.length == 0) {
            return Promise.reject("invalid recipientId");
          }
        });
    }),

  body("recipientEmail")
    .trim()
    .toLowerCase()
    .normalizeEmail()
    .isEmail()
    .withMessage("email must be a valid email address")
    .optional()
    .custom((value) => {
      return db
        .select("*")
        .from("users")
        .where({ email: value })
        .then((email) => {
          if (email.length == 0) {
            return Promise.reject("invalid recipientEmail");
          }
        });
    }),

  body("password").notEmpty().trim(),
];
