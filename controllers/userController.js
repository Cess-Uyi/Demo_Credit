const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../db/db");

const { validationResult } = require("express-validator");
const { errorResponse, successResponse } = require("../handler/response");

class Users {
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "validation error", errors.mapped());
    }

    try {
      // hashing the password
      const hashedPassword = await bcrypt.hash(req.body.password, 12);

      let userDTO = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      };

      // create user and save to db
      const newUser = db("users")
        .insert(userDTO)
        .then((id) => {
          // get user by id
          return db("users")
            .where({ id })
            .then((user) => {
              // JSON.parse(JSON.stringify(user[0])) gets the raw data without RowDataPacket
              return JSON.parse(JSON.stringify(user[0]));
            });
        });

      // create wallet for user and save to db
      const userWallet = db("wallets")
        .insert({
          user_id: newUser.id,
          balance: "0",
        })
        .then((id) => {
          // get wallet by id
          return db("wallets")
            .where({ id })
            .then((wallet) => {
              // JSON.parse(JSON.stringify(wallet[0])) gets the raw data without RowDataPacket
              return JSON.parse(JSON.stringify(wallet[0]));
            });
        });

      // sign token
      const token = jwt.sign(
        {
          id: newUser.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      //remove the password from the user data gotten from the db
      const { password, ...userDetails } = newUser;

      return successResponse(res, 201, "sign up completed", {
        token,
        user: userDetails,
        wallet: userWallet,
      });
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "validation error", errors.mapped());
    }
    try {
      // getting the password from req.body
      const { email, password } = req.body;

      // check if email exists on db
      let user = await db("users").where({ email: email });

      // JSON.parse(JSON.stringify(user[0])) gets the raw data without RowDataPacket
      user = JSON.parse(JSON.stringify(user[0]));

      if (!user) {
        return errorResponse(res, 400, "invalid email or password", null);
      } else {
        // check validity of password
        const valid = await bcrypt.compareSync(password, user.password);

        if (!valid) {
          return errorResponse(res, 409, "invalid login details", null);
        } else {
          // create a token
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );

          // remove the password from the user data gotten from the db
          const { password, ...userDetails } = user;

          return successResponse(res, 200, "login successful", {
            token,
            user: userDetails,
          });
        }
      }
    } catch (err) {
      errorResponse(res, 500, "internal server error", err.message);
    }
  }
}

module.exports = Users;
