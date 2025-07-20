import nodemailer from 'nodemailer';
import { config } from '../config/enviroment';

// Create a single transporter using environment variables
const transporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Interface for email options
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Send verification email
export const sendVerificationEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: `"LMS Support" <${config.emailUser}>`,
    to: options.to,
    subject: options.subject,
    text: options.text || '',
    html: options.html || '',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${options.to}`);
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw new Error('Email could not be sent');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<boolean> => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: `"LMS Support" <${config.emailUser}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return false;
  }
};
