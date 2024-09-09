const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const User = require("../models/user");
const OTP = require("../models/otp");
const Investment = require("../models/Investment");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, otp } = req.body;

        if (!name || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match.",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in.",
            });
        }

        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!recentOtp || otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            user,
            message: "User registered successfully.",
        });
    } catch (error) {
        console.error('Error during signup:', error);

        // Detailed error response for debugging
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message, // Including error details for debugging
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered. Please sign up.",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user.id, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            res.cookie("token", token, {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }).status(200).json({
                success: true,
                token,
                user,
                message: "Login successful.",
            });

        } else {
            return res.status(401).json({
                success: false,
                message: "Incorrect password.",
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "Login failure. Please try again.",
            error: error.message,
        });
    }
};

exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required.',
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already registered.',
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let otpRecord = await OTP.findOne({ otp });
        while (otpRecord) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            otpRecord = await OTP.findOne({ otp });
        }

        const otpPayload = { email, otp };
        await OTP.create(otpPayload);

        // Optionally send the OTP via email
        // mailSender.sendOtp(email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully.',
            otp,
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while sending OTP.",
            error: error.message,
        });
    }
};

exports.investment = async (req, res) => {
    try {
        const { productName, principal, rate, startDate, endDate, interest } = req.body;
        const userId = req.user.id;

        if (!userId) {
            console.log('User not authenticated.');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated. Please log in.',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found.');
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        const totalInvested = (user.totalInvested || 0) + principal;
        if (totalInvested > 100000) {
            console.log('Investment limit exceeded.');
            return res.status(400).json({
                success: false,
                message: 'Investment limit exceeded. You can only invest up to 100,000.',
            });
        }

        const investment = await Investment.create({
            productName,
            principal,
            rate,
            startDate,
            endDate,
            interest,
            user: userId,
            investorName: user.name, // Add the investor's name here
        });

        user.totalInvested = totalInvested;
        await user.save();

        return res.status(201).json({
            success: true,
            investment,
            message: "Investment successful.",
        });
    } catch (error) {
        console.error('Investment error:', error);
        return res.status(500).json({
            success: false,
            message: "Unable to invest. Please try again.",
            error: error.message,
        });
    }
};

