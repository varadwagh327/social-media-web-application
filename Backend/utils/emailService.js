import nodemailer from 'nodemailer';
import config from '../config/index.js';

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.smtpHost,
    port: config.email.smtpPort,
    secure: config.email.smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: config.email.smtpUser,
      pass: config.email.smtpPassword,
    },
  });
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, fullName, verificationLink) => {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Social Media!</h2>
          <p>Hi ${fullName},</p>
          <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
          <div style="margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>If you didn't create this account, please ignore this email.</p>
          <p>The link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">© 2024 Social Media. All rights reserved.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `${config.email.fromName} <${config.email.fromEmail}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, fullName, resetLink) => {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${fullName},</p>
          <p>We received a request to reset your password. Click the link below to create a new password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this, you can ignore this email.</p>
          <p>The link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">© 2024 Social Media. All rights reserved.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `${config.email.fromName} <${config.email.fromEmail}>`,
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email, fullName) => {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Social Media!</h2>
          <p>Hi ${fullName},</p>
          <p>Your account has been successfully created. You can now:</p>
          <ul>
            <li>Create and share posts</li>
            <li>Follow other users</li>
            <li>Like and comment on posts</li>
            <li>Send direct messages</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="${config.frontend.url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Exploring
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">© 2024 Social Media. All rights reserved.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `${config.email.fromName} <${config.email.fromEmail}>`,
      to: email,
      subject: 'Welcome to Social Media!',
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
