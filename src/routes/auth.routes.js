const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/check-otp", authController.checkOTP);
router.get("/who-am-i", authMiddleware, authController.whoAmI);

module.exports = router;
