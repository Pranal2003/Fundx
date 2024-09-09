const express = require('express');
const router = express.Router();
const { login, signup, sendotp, investment } = require("../controllers/userController");
const authenticateToken = require('../middleware/authenticateToken');

// Route to send OTP for login/signup
router.post("/sendotp", sendotp);

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Route for investment, protected by authentication
router.post("/investment", authenticateToken, investment);

module.exports = router;
