const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP'); // Import OTP model
const transporter = require('../config/nodemailer');
const {
    registerValidationSchema,
    verifyOtpValidationSchema,
    loginValidationSchema
} = require('../validators/authValidation');

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register User & Send OTP
exports.registerUser = async (req, res) => {
    const { error } = registerValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email Already In Use' });

        const otp = generateOTP();

        // Store OTP in the database
        const otpRecord = new OTP({
            email,
            otp,
        });

        await otpRecord.save(); // Save OTP to MongoDB

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) return res.status(500).json({ message: 'Error sending OTP' });
            res.status(200).json({ message: 'OTP sent to your email' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in registration process', error: error.message });
    }
};

// Verify OTP & Register User
exports.verifyOTP = async (req, res) => {
    const { error } = verifyOtpValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, otp, name, password } = req.body;
    if (!email || !otp || !name || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Fetch OTP from the database
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }

        // Check if OTP is expired (for example, 2 minutes expiry)
        const otpCreatedAt = otpRecord.createdAt;
        const expirationTime = 2 * 60 * 1000; // 2 minutes in milliseconds

        if (Date.now() - otpCreatedAt.getTime() > expirationTime) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // OTP is valid, now hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isVerified: true,
        });

        await newUser.save();
        // Remove the OTP record from the database after successful registration
        await OTP.deleteOne({ email });

         // Prepare and send the email with user credentials
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Account Registration Successful',
            html: `
                <h1>Welcome to Our Platform!</h1>
                <p>Dear ${name},</p>
                <p>Your account has been successfully registered. Below are your credentials:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>Please keep this information secure.</p>
                <p>Thank you for joining us!</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'User registered, but failed to send credentials email' });
            }
            console.log('Email sent: ' + info.response);
        });

        res.status(200).json({ message: 'User verified and registered successfully', redirect: true });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user after OTP verification', error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { error } = loginValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid Email' });

        const isPasswordMatch = bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ message: 'Invalid credentials' });

        if (!user.isVerified) return res.status(401).json({ message: 'User is not verified. Please complete OTP verification.' });

        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
