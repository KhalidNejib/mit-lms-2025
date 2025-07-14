import { Request, Response } from 'express';
import { User, IUser} from '../models/User.model'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { forgotPasswordSchema, resetPasswordSchema } from '../utils/validator';
import { generateResetToken, validateResetToken } from '../services/passwordReset.service';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/email.service';
import crypto from "crypto"

import{config } from "../config/enviroment"

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists' });
      return;
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'student'
    }) as IUser;

    //generate a verification token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  
    
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await user.save();
     // Create verification link
     const verifyURL = `${config.clientUrl}/verifyemail/${rawToken}`;

     // Send verification email
     const emailHTML = `
       <h2>Hi ${user.firstName},</h2>
       <p>Please verify your email by clicking the link below:</p>
       <a href="${verifyURL}" target="_blank">${verifyURL}</a>
       <p>This link will expire in 1 hour.</p>
     `;
     await sendVerificationEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      html: emailHTML,
    });

    const accessToken = generateAccessToken(user._id.toString());

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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//verify email 
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ success: false, message: 'Verification token is missing' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
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
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
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

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update current user profile
export const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'avatar', 'bio', 'dateOfBirth', 
      'phone', 'address', 'preferences'
    ];

    const updateData: Partial<IUser> = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field as keyof IUser] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    console.error('Update current user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Change password after the user logged in
export const changePassword = async (req: Request, res: Response): Promise<void> => {
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

    const user = await User.findById(req.user._id);
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
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//frorgot and reset password brfore the user logged in 
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email } = req.body;
    const result = await generateResetToken(email); // This should save token to DB too

    if (!result.success || !result.token) {
      res.status(404).json({ message: 'No account found with that email address' });
      return;
    }

    // ✅ Send the reset email using your service
    const emailSent = await sendPasswordResetEmail(email, result.token);

    if (!emailSent) {
      res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
      return;
    }

    // ✅ Success response (in production, don't reveal token)
    res.status(200).json({
      message: 'If an account exists with that email, a password reset link has been sent.',
      token: result.token // 🔧 For testing only — remove in production!
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { token, newPassword } = req.body;
    const success = await validateResetToken(token, newPassword);

    if (!success) {
      res.status(400).json({
        message: 'Invalid or expired password reset token'
      });
      return;
    }

    res.status(200).json({
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Verify token and check if it exists in DB before issuing new access token

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ success: false, message: 'Refresh token required' });
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken) as { userId: string };

    // Cast user as IUser | null for correct typing
    const user = await User.findById(payload.userId) as IUser | null;

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
    const newAccessToken = generateAccessToken(user._id.toString());

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};


// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
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
    const user = await User.findById(req.user._id) as IUser | null;

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Remove the refresh token from user's refreshTokens array
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);

    await user.save();

    res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
