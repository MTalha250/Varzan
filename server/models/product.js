import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    details: {
      type: Array,
      required: true,
      default: [],
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    inHighlight: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
