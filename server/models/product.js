import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["template", "print"],
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // Size-specific frame pricing and discounts
    sizeSpecificPricing: {
      type: Map,
      of: {
        framePrice: { type: Number, default: 0 },
        frameDiscount: { type: Number, default: 0 },
      },
      default: new Map(),
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    // Print type options (only for type: "print")
    digitalPrint: {
      type: Boolean,
      default: false,
    },
    framedPrint: {
      type: Boolean,
      default: false,
    },
    // High quality images for different sizes
    highQualityPrints: {
      type: Map,
      of: String, // Cloudinary URLs mapped to sizes
      default: new Map(),
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
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    sizes: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
    },
    productLink: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for final digital price
productSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});

// Method to get frame price for specific size
productSchema.methods.getFramePriceForSize = function (size) {
  const sizeData = this.sizeSpecificPricing?.get(size);
  if (sizeData && sizeData.framePrice !== undefined) {
    // Use size-specific pricing
    const framePrice = sizeData.framePrice;
    const frameDiscount = sizeData.frameDiscount || 0;
    return framePrice - (framePrice * frameDiscount) / 100;
  }
  // Return 0 if no size-specific pricing found
  return 0;
};

// Method to get raw frame price for specific size (before discount)
productSchema.methods.getRawFramePriceForSize = function (size) {
  const sizeData = this.sizeSpecificPricing?.get(size);
  if (sizeData && sizeData.framePrice !== undefined) {
    return sizeData.framePrice;
  }
  return 0;
};

// Method to get frame discount for specific size
productSchema.methods.getFrameDiscountForSize = function (size) {
  const sizeData = this.sizeSpecificPricing?.get(size);
  if (sizeData && sizeData.frameDiscount !== undefined) {
    return sizeData.frameDiscount;
  }
  return 0;
};

// Method to get all frame pricing information for admin display
productSchema.methods.getFramePricingSummary = function () {
  const summary = {};
  if (this.sizeSpecificPricing) {
    for (const [size, pricing] of this.sizeSpecificPricing) {
      summary[size] = {
        framePrice: pricing.framePrice,
        frameDiscount: pricing.frameDiscount,
        finalFramePrice:
          pricing.framePrice -
          (pricing.framePrice * (pricing.frameDiscount || 0)) / 100,
      };
    }
  }
  return summary;
};

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
