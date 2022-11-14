const express = require("express");
const router = express.Router();

const userRoute = require("./userRouter")
const walletRoute = require("./walletRouter")

router.use("/users", userRoute);
router.use("/wallets", walletRoute);


module.exports = router;
