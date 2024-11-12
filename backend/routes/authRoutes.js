const express = require('express');
const router = express.Router();
const { registerUser, verifyOTP, loginUser } = require('../controllers/authController');
const { registerValidationSchema, verifyOtpValidationSchema, loginValidationSchema, validate } = require('../validators/authValidation');

// Register User (Step 1: Send OTP)
router.post('/register', validate(registerValidationSchema), registerUser);

// OTP Verification (Step 2: Verify OTP and save user data)
router.post('/verify-otp', validate(verifyOtpValidationSchema), verifyOTP);

// Login User
router.post('/login', validate(loginValidationSchema), loginUser);

module.exports = router;
