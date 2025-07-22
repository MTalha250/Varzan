import Product from "../models/product.js";
import Contact from "../models/contact.js";
import Category from "../models/category.js";

export const getDashboardStats = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const highlightedProductCount = await Product.countDocuments({
      inHighlight: true,
    });
    const contactCount = await Contact.countDocuments();
    const categoryCount = await Category.countDocuments();

    res.status(200).json({
      productCount,
      highlightedProductCount,
      contactCount,
      categoryCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
