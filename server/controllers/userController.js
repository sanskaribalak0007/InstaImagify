import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();

import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, Message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      text: `Click here to reset your password: ${resetLink}`,
    };

    // Send Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);  // Log the error for debugging
        return res.json({ success: false, Message: "Email sending failed" });
      }
      res.json({ success: true, Message: "Password reset link sent!" });
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);  // Log the error
    res.json({ success: false, Message: "Something went wrong!" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Check expiry
    });

    if (!user) {
      return res.json({ success: false, Message: "Invalid or expired token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, Message: "Password reset successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, Message: "Something went wrong!" });
  }
};


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, Message: "Missing Details" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, Message: error.Message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, Message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token, user: { name: user.name } });
    } else {
      return res.json({ success: false, Message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, Message: error.Message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.log(error.Message);
    res.json({ success: false, Message: error.Message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.json({ success: false, Message: "Invalid User or Plan Id" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, Message: "Plan not found!" });
    }

    const newTransaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
      date: Date.now(),
    });

    const options = {
      amount: amount * 100, // Convert to paise
      currency: process.env.CURRENCY || "INR",
      receipt: newTransaction._id.toString(),
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpayInstance.orders.create(options);
    if (!order) {
      return res.json({ success: false, Message: "Order creation failed" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment Error:", error);
    res.json({ success: false, Message: error.message });
  }
}; 
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, Message: "Invalid payment data" });
    }

    // Generate expected signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        Message: "Payment verification failed",
      });
    }

    // Fetch order details
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (!orderInfo) {
      return res.json({ success: false, Message: "Order not found" });
    }

    const transactionData = await transactionModel.findById(orderInfo.receipt);
    if (!transactionData || transactionData.payment) {
      return res.json({
        success: false,
        Message: "Invalid transaction or already paid",
      });
    }

    // Update user credits
    const userData = await userModel.findById(transactionData.userId);
    const updatedCredits = userData.creditBalance + transactionData.credits;

    await userModel.findByIdAndUpdate(userData._id, {
      creditBalance: updatedCredits,
    });
    await transactionModel.findByIdAndUpdate(transactionData._id, {
      payment: true,
    });

    res.json({ success: true, Message: "Credits added successfully" });
  } catch (error) {
    console.error("Verification Error:", error);
    res.json({ success: false, Message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyRazorpay,
  forgotPassword,
  resetPassword,
};

