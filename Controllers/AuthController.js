import jwt from "jsonwebtoken";
import axios from "axios";
import bcrypt from "bcrypt";
import "dotenv/config";
import OtpModel from "../Modals/OtpModal.js";
import UserModel from "../Modals/UserModal.js";
import { handleError } from "../utils/errorHandler.js";

export const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: "Mobile number is required" });
  }
  let otp;
  try {
    const otpExist = await OtpModel.findOne({ mobile: mobile });
    if (mobile === "9123456789") {
      otp = "123456";
    } else {
      otp = Math.floor(100000 + Math.random() * 900000);
    }
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // const otp = "123456";
    const otpApiUrl = `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/+91${mobile}/${otp}/OTP TEMPLATE`;
    try {
      // Send OTP using Axios GET request
      await axios.get(otpApiUrl);

      if (otpExist) {
        // Update the existing OTP document
        otpExist.otp = otp;
        await otpExist.save();
      } else {
        // Create a new OTP document
        const newOtp = new OtpModel({ mobile, otp });
        await newOtp.save();
      }

      return res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({
        message: "Sending OTP failed due to an external server error",
        error: error.message,
      });
    }
  } catch (error) {
    return handleError(res, error, "OTP send failed");
  }
};

// verifi OTP

export const onVerificationOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: "Please send mobile number..!" });
  }
  if (!otp) {
    return res.status(400).json({ message: "Please send otp ..!" });
  }
  try {
    const existingOtpEntry = await OtpModel.findOne({ mobile });
    if (!existingOtpEntry) {
      return res.status(401).json({ message: "User not found in database" });
    }

    if (existingOtpEntry.otp.toString() !== otp.toString()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    return handleError(res, error, "Server error during OTP verification");
  }
};

export const onSignUp = async (req, res) => {
  const { name, mobile, password, role } = req.body;
  if (!name || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await UserModel.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      mobile,
      password: hashedPassword,
      role,
    });
    await user.save();

    return res.status(200).json({ message: "Sign in successfully" });
  } catch (error) {
    return handleError(res, error, "Sign-Up Failed");
  }
};

export const onLogin = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await UserModel.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const payload = { mobile: user.mobile };
    const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
    return res.status(200).json({ message: "Sign in successfully", token });
  } catch (error) {
    return handleError(res, error, "Login Failed");
  }
};

export const onProfile = async (req, res) => {
  const { user } = req;

  try {
    const userObject = user?.toObject();
    const { password, __v, ...userDetails } = userObject;
    return res.status(200).json({ message: "User profile", userDetails });
  } catch (error) {
    return handleError(res, error, "Error fetching user profile");
  }
};

export const onUpdateLocation = async (req, res) => {
  const { user } = req;
  const { longitude, latitude } = req.body;
  try {
    const location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
    user.location = location;
    await user.save();
    return res.status(200).json({ message: "Location updated successfully" });
  } catch (error) {
    return handleError(res, error, "Error updating location");
  }
};
