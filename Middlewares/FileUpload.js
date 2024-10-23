// middlewares/uploadMiddleware.js
import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Unique filename with timestamp
  },
});

// File type filtering
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; // Allow only JPEG, JPG, and PNG
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, PNG) are allowed"));
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

// Export middleware for both main image and variant images
export const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 }, // Single main image
  { name: "variantImages", maxCount: 5 }, // Up to 5 variant images
]);
