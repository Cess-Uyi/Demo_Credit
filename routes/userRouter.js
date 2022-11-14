// importing controller
const userController = require("../controllers/userController");

const ValidateAuth = require('../handler/validator/auth')

// router
const router = require("express").Router();

// routes
router.post("/register", ValidateAuth.REGISTER, userController.register);

router.post("/login", ValidateAuth.LOGIN, userController.login);

module.exports = router;
