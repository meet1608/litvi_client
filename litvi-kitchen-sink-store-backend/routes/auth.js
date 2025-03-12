const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/Peoples");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

require('dotenv').config();
const router = express.Router();



const transporter = nodemailer.createTransport({
  service: 'gmail', // or use your SMTP server
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  }
});

router.get('/register', async (req, res) => {
  try {
      const emailExists = await User.find();
      res.status(200).json(emailExists);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.toString() });
  }
});


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;



    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false
  });
  

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp,
    });

    // Save user to database
    await newUser.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
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
                  background-color: #28a745;
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
                  background: #d4edda;
                  color: #155724;
                  padding: 10px;
                  text-align: center;
                  border-radius: 5px;
                  border: 1px solid #c3e6cb;
                  margin: 20px 0;
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
              <div class="header">Email Verification</div>
              <div class="content">
                  <p>Thank you for signing up! Please use the OTP below to verify your email address:</p>
                  <div class="otp-box">${otp}</div>
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
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      res.status(201).json({ message: "OTP sent to your email" });
    });
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
