const jwt = require("jsonwebtoken");
const { errorResponse } = require("../response");

const db = require("../../db/db");

const checkAuth = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return errorResponse(res, 401, "no token", null);
  }
  try {
    const token = bearerToken.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return errorResponse(res, 401, "invalid signature token", null);
    }
    let foundUser = await db
      .select("*")
      .from("users")
      .where({ id: verifyToken.id });

    // JSON.parse(JSON.stringify(user[0])) gets the raw data without RowDataPacket
    foundUser = JSON.parse(JSON.stringify(foundUser[0]));

    //remove the password from the user data gotten from the db
    const { password, ...userDetails } = foundUser;

    if (!userDetails) {
      return errorResponse(res, 404, "user not found", null);
    }
    req.user = userDetails;
    next();
  } catch (err) {
    errorResponse(res, 500, "internal server error", err.message);
  }
};

module.exports = checkAuth;
