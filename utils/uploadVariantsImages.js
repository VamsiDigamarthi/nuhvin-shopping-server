// middlewares/variantImageUploadMiddleware.js

import { uploadVariantImages } from "../Middlewares/FileUpload.js";

export const handleVariantImageUploads = (req, res, next) => {
  // Prepare to handle dynamic variant image uploads
  const variantImageUploads = [];

  // Check if variants are provided in the request
  if (req.body.variants) {
    const variants = JSON.parse(req.body.variants); // Parse the variants from JSON

    // Iterate over the variants and prepare upload fields
    variants.forEach((_, index) => {
      const fieldName = `variantImages-${index}`; // Construct the field name
      variantImageUploads.push(
        uploadVariantImages.fields([{ name: fieldName, maxCount: 5 }])
      ); // Push upload middleware for each variant
    });
  }

  // Call the next middleware function after preparing uploads
  next();
};
