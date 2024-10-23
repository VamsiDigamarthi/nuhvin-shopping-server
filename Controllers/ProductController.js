// Controllers/ProductController.js
import ProductModal from "../Modals/ProductModal.js";

export const addProduct = async (req, res) => {
  const { user } = req; // Assuming user is authenticated and stored in req.user
  try {
    const {
      productName,
      productDescription,
      price,
      ages,
      category,
      brand,
      discount,
      tags,
      availabilityStatus,
      returnPolicy,
      warranty,
      variants,
    } = req.body;

    // Handle main image and variant images
    const mainImage = req.files.mainImage ? req.files.mainImage[0].path : null; // Assuming you're saving the file path
    const variantImages = req.files.variantImages
      ? req.files.variantImages.map((file) => file.path)
      : [];

    // Build the product variants array
    const parsedVariants = variants ? JSON.parse(variants) : [];
    const processedVariants = parsedVariants.map((variant, index) => ({
      color: variant.color,
      variantImages: variantImages.slice(
        index * variant.variantImages.length,
        (index + 1) * variant.variantImages.length
      ), // Handle variant images
      sizes: variant.sizes.map((size) => ({
        size: size.size,
        stockQuantity: size.stockQuantity,
      })),
    }));

    // Create new product
    const newProduct = new ProductModal({
      productName,
      productDescription,
      price,
      ages: JSON.parse(ages),
      category,
      brand,
      mainImage,
      discount,
      tags: JSON.parse(tags),
      availabilityStatus,
      returnPolicy,
      warranty,
      variants: processedVariants,
      sellerInfo: user._id,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();
    return res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
