const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/Peoples");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken"); // Import JWT
require("dotenv").config();

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ✅ Send OTP for password reset
router.post("/send-reset-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token containing user ID and OTP
    const payload = {
      userId: user._id,
      otp: otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
        alphabets: false,
      }),
    };

    const secretKey = process.env.JWT_SECRET || "fallbackSecret"; // Use a strong secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: "10m" }); // Token expires in 10 minutes

    // Save OTP to user document
    user.otp = payload.otp;
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${payload.otp}. It is valid for 10 minutes.`,
    
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 30px auto;
                  background: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                  border: 1px solid #ddd;
              }
              .header {
                  background-color: #007BFF;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  font-size: 26px;
                  font-weight: bold;
              }
              .content {
                  padding: 25px;
                  line-height: 1.8;
              }
              .otp-box {
                  display: block;
                  font-size: 22px;
                  font-weight: bold;
                  background: #f8d7da;
                  color: #721c24;
                  padding: 10px;
                  text-align: center;
                  border-radius: 5px;
                  border: 1px solid #f5c6cb;
                  margin: 20px 0;
              }
              .button {
                  display: inline-block;
                  padding: 12px 25px;
                  margin: 20px 0;
                  background-color: #007BFF;
                  color: white !important;
                  text-decoration: none;
                  border-radius: 5px;
                  text-align: center;
                  font-size: 16px;
                  font-weight: bold;
                  transition: background-color 0.3s;
              }
              .button:hover {
                  background-color: #0056b3;
              }
              .footer {
                  background-color: #f4f4f4;
                  padding: 15px;
                  text-align: center;
                  color: #777;
                  font-size: 12px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">Password Reset Request</div>
              <div class="content">
                  <p>Hello ${user?.email || "User"},</p>
                  <p>We received a request to reset your password. Use the OTP below to proceed:</p>
                  <div class="otp-box">${payload.otp}</div>
                  <p>The OTP is valid for 10 minutes.</p>
                  <p>If you did not request this, please ignore this email or contact support.</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `,
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      res.status(200).json({ message: "OTP sent to email", token: token }); // Send the token back
    });
  } catch (error) {
    console.error("Error in /send-reset-otp route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, token } = req.body; // Retrieve the token
    const secretKey = process.env.JWT_SECRET || "fallbackSecret";

    // Verify the token
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const { userId } = decoded;

      // Retrieve user by ID
      const user = await User.findById(userId);

      if (!user || user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      user.isVerified = true;
      user.otp = null; // Clear OTP after verification
      await user.save();

      res.status(200).json({ message: "OTP verified successfully" });
    });
  } catch (error) {
    console.error("Error in /verify-otp route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const secretKey = process.env.JWT_SECRET || "fallbackSecret";

    // Verify token
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const { userId } = decoded;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // Hash new password
      user.password = await bcrypt.hash(newPassword, 10);
      user.isVerified = false; // Reset verification status
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    });
  } catch (error) {
    console.error("Error in /reset-password route:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
