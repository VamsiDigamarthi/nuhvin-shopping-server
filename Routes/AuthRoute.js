import express from "express";
import {
  onLogin,
  onProfile,
  onSignUp,
  onUpdateLocation,
  onVerificationOtp,
  sendOtp,
} from "../Controllers/AuthController.js";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";

const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/verify-otp", onVerificationOtp);

router.post("/sign-up", onSignUp);

router.post("/sign-in", onLogin);

router.get("/profile", authenticateToken, CheckingUser, onProfile);

router.patch(
  "/update-location",
  authenticateToken,
  CheckingUser,
  onUpdateLocation
);

export default router;
