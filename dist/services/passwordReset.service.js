"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetToken = exports.generateResetToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_model_1 = require("../models/User.model");
const email_service_1 = require("./email.service");
// Track reset attempts per email
const resetAttempts = new Map();
const MAX_ATTEMPTS = 3;
const ATTEMPT_WINDOW = 3600000; // 1 hour in milliseconds
const generateResetToken = async (email) => {
    try {
        // Check attempt limits
        const attempts = resetAttempts.get(email) || { count: 0, lastAttempt: 0 };
        const now = Date.now();
        // Reset attempts if window has passed
        if (now - attempts.lastAttempt > ATTEMPT_WINDOW) {
            attempts.count = 0;
        }
        // Check if max attempts reached
        if (attempts.count >= MAX_ATTEMPTS) {
            return { success: false };
        }
        // Update attempts
        resetAttempts.set(email, {
            count: attempts.count + 1,
            lastAttempt: now
        });
        const user = await User_model_1.User.findOne({ email });
        if (!user) {
            return { success: false };
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        // Set token and expiration (1 hour from now)
        user.resetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpires = new Date(Date.now() + ATTEMPT_WINDOW);
        await user.save();
        // Send email with reset token
        const emailSent = await (0, email_service_1.sendPasswordResetEmail)(email, resetToken);
        if (!emailSent) {
            console.error('Failed to send password reset email');
            return { success: true, token: resetToken }; // Keep returning token for testing
        }
        return { success: true, token: resetToken }; // Keep returning token for testing
    }
    catch (error) {
        console.error('Error generating reset token:', error);
        return { success: false };
    }
};
exports.generateResetToken = generateResetToken;
const validateResetToken = async (token, newPassword) => {
    try {
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = await User_model_1.User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return false;
        }
        // Update password and clear reset token fields
        user.password = newPassword;
        user.resetPasswordToken = '';
        user.resetPasswordExpires = new Date(0);
        await user.save();
        // Clear reset attempts for this email
        resetAttempts.delete(user.email);
        return true;
    }
    catch (error) {
        console.error('Error validating reset token:', error);
        return false;
    }
};
exports.validateResetToken = validateResetToken;
