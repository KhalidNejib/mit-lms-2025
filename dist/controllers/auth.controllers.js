"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.updateCurrentUser = exports.getCurrentUser = exports.login = exports.verifyEmail = exports.register = void 0;
const User_model_1 = require("../models/User.model");
const jwt_1 = require("../utils/jwt");
const validator_1 = require("../utils/validator");
const passwordReset_service_1 = require("../services/passwordReset.service");
const email_service_1 = require("../services/email.service");
const crypto_1 = __importDefault(require("crypto"));
const enviroment_1 = require("../config/enviroment");
// Register new user
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        const existingUser = await User_model_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'User with this email already exists' });
            return;
        }
        const user = new User_model_1.User({
            email,
            password,
            firstName,
            lastName,
            role: role || 'student'
        });
        //generate a verification token
        const rawToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await user.save();
        // Create verification link
        const verifyURL = `${enviroment_1.config.clientUrl}/verifyemail/${rawToken}`;
        // Send verification email
        const emailHTML = `
       <h2>Hi ${user.firstName},</h2>
       <p>Please verify your email by clicking the link below:</p>
       <a href="${verifyURL}" target="_blank">${verifyURL}</a>
       <p>This link will expire in 1 hour.</p>
     `;
        await (0, email_service_1.sendVerificationEmail)({
            to: user.email,
            subject: 'Verify Your Email Address',
            html: emailHTML,
        });
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        user.lastLogin = new Date();
        await user.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully.Please check your email to verify your account.',
            data: {
                user: user.toSafeObject(),
                accessToken
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.register = register;
//verify email 
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            res.status(400).json({ success: false, message: 'Verification token is missing' });
            return;
        }
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await User_model_1.User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: new Date() },
        });
        if (!user) {
            res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
            return;
        }
        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        res.json({
            success: true,
            message: 'Email verified successfully. You can now log in.',
        });
    }
    catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.verifyEmail = verifyEmail;
// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_model_1.User.findOne({ email });
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'Invalid credentials or account deactivated' });
            return;
        }
        //check email verification
        if (!user.emailVerified) {
            res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in.',
            });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
        //save refresh token in database
        user.refreshTokens.push(refreshToken);
        user.lastLogin = new Date();
        await user.save();
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toSafeObject(),
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.login = login;
// Get current user
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }
        const user = await User_model_1.User.findById(req.user._id).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({
            success: true,
            message: 'User profile retrieved successfully',
            data: { user: user.toSafeObject() }
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getCurrentUser = getCurrentUser;
// Update current user profile
const updateCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }
        const allowedUpdates = [
            'firstName', 'lastName', 'avatar', 'bio', 'dateOfBirth',
            'phone', 'address', 'preferences'
        ];
        const updateData = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        const user = await User_model_1.User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true }).select('-password');
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: user.toSafeObject() }
        });
    }
    catch (error) {
        console.error('Update current user error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.updateCurrentUser = updateCurrentUser;
// Change password after the user logged in
const changePassword = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ success: false, message: 'Both passwords are required' });
            return;
        }
        const user = await User_model_1.User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            res.status(401).json({ success: false, message: 'Incorrect current password' });
            return;
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.changePassword = changePassword;
//frorgot and reset password brfore the user logged in 
const forgotPassword = async (req, res) => {
    try {
        const { error } = validator_1.forgotPasswordSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        const { email } = req.body;
        const result = await (0, passwordReset_service_1.generateResetToken)(email); // This should save token to DB too
        if (!result.success || !result.token) {
            res.status(404).json({ message: 'No account found with that email address' });
            return;
        }
        // ✅ Send the reset email using your service
        const emailSent = await (0, email_service_1.sendPasswordResetEmail)(email, result.token);
        if (!emailSent) {
            res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
            return;
        }
        // ✅ Success response (in production, don't reveal token)
        res.status(200).json({
            message: 'If an account exists with that email, a password reset link has been sent.',
            token: result.token // 🔧 For testing only — remove in production!
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { error } = validator_1.resetPasswordSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        const { token, newPassword } = req.body;
        const success = await (0, passwordReset_service_1.validateResetToken)(token, newPassword);
        if (!success) {
            res.status(400).json({
                message: 'Invalid or expired password reset token'
            });
            return;
        }
        res.status(200).json({
            message: 'Password has been reset successfully'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.resetPassword = resetPassword;
//Verify token and check if it exists in DB before issuing new access token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ success: false, message: 'Refresh token required' });
        return;
    }
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        // Cast user as IUser | null for correct typing
        const user = await User_model_1.User.findById(payload.userId);
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid refresh token' });
            return;
        }
        // Check if user's refreshTokens array includes the token
        if (!user.refreshTokens.includes(refreshToken)) {
            res.status(401).json({ success: false, message: 'Refresh token revoked' });
            return;
        }
        // Generate a new access token
        const newAccessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
        res.json({
            success: true,
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};
exports.refreshToken = refreshToken;
// Logout
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ success: false, message: 'Refresh token required' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }
        // Cast user as IUser for TS clarity
        const user = await User_model_1.User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        // Remove the refresh token from user's refreshTokens array
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        await user.save();
        res.json({ success: true, message: 'Logout successful' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.logout = logout;
