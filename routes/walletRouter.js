// importing controller
const walletController = require("../controllers/walletController")

// router
const router = require("express").Router();

// routes
router.post("/fund", walletController.fund)

module.exports = router;