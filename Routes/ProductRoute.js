// Routes/ProductRoutes.js
import express from "express";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";
import { addProduct } from "../Controllers/ProductController.js";
import { uploadProductImages } from "../Middlewares/FileUpload.js";
const router = express.Router();

// Route to handle adding a new product
router.post(
  "/add",
  authenticateToken,
  CheckingUser,
  uploadProductImages,
  addProduct
);

export default router;
