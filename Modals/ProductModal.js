import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ages: [],
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },

  mainImage: {
    type: String, // URLs for product images
    required: true,
  },

  sellerInfo: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model for seller information
  },
  variants: [
    {
      color: {
        type: String, // e.g., Red, Blue
        required: true,
      },
      variantImages: [
        {
          type: String, // URLs for images specific to this color variant
        },
      ],
      sizes: [
        {
          size: { type: String, required: true }, // e.g., S, M, L, XL
          // price: { type: Number, required: true }, // Price for this size
          stockQuantity: { type: Number, required: true }, // Stock quantity for this size
        },
      ],
    },
  ],
  discount: {
    type: Number, // Percentage or fixed amount
  },
  tags: [String],
  reviews: [
    {
      reviewText: { type: String },
      rating: { type: Number },
      reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  availabilityStatus: {
    type: String,
    enum: ["In Stock", "Out of Stock"],
    required: true,
  },
  returnPolicy: {
    type: String, // Details about the return policy
  },
  warranty: {
    type: String, // Warranty or guarantee information
  },
  featuredProduct: {
    type: Boolean, // Flag to indicate if the product is featured
    default: false,
  },
  relatedProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product", // Reference to other products
    },
  ],
});

const ProductModal = mongoose.model("Product", productSchema);

export default ProductModal;
