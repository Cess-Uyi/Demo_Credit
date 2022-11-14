// importing controller
const walletController = require("../controllers/walletController");

const ValidateAuth = require("../handler/validator/wallet");
const checkAuth = require("../handler/middlewares/checkAuth");

// router
const router = require("express").Router();

// routes
router.post("/fund", checkAuth, ValidateAuth.FUND, walletController.fund);

router.post("/withdraw", checkAuth, ValidateAuth.WITHDRAW, walletController.withdraw);


module.exports = router;
