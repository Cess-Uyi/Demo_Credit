const { body } = require("express-validator");

const db = require("../../db/db");

exports.FUND = [body("amount").isString().trim().notEmpty()];

exports.WITHDRAW = [body("amount").isString().trim().notEmpty()];
