const Joi = require('joi');

// Register Validation Schema
const registerValidationSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// OTP Verification Schema
const verifyOtpValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
});

// Login Validation Schema
const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Middleware to validate request data using Joi
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            // If validation fails, return error message
            return res.status(400).json({ message: error.details[0].message });
        }
        next(); // If validation passes, continue to the next middleware/route handler
    };
};

module.exports = {
    registerValidationSchema,
    verifyOtpValidationSchema,
    loginValidationSchema,
    validate, // Export the validate function
};
