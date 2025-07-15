import nodemailer from 'nodemailer';

import {config} from "../config/enviroment"


const passTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser ,
    pass: config.emailPassword,
  },
  debug: true, // Enable debug logging
  logger: true // Enable logger
});

// Verify connection configuration
passTransporter.verify(function(error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});




export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<boolean> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await passTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

const emailTransporter = nodemailer.createTransport({
  service: 'gmail', // or use custom SMTP if needed
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}




export const sendVerificationEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: `"LMS Support" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text || '',
    html: options.html || '',
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${options.to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};