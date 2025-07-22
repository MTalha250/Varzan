import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  const {
    name,
    images,
    category,
    details,
    inStock,
    inHighlight = false,
  } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      images,
      category,
      details,
      inStock,
      inHighlight,
    });
    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  try {
    const totalProducts = await Product.countDocuments();
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find()
      .sort({
        inStock: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const { category } = req.params;
  try {
    const totalProducts = await Product.countDocuments({ category });
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find({ category })
      .sort({ inStock: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(8);
    res.status(200).json({ product, related });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    images,
    category,
    details,
    inStock,
    inHighlight = false,
  } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        images,
        category,
        details,
        inStock,
        inHighlight,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterProducts = async (req, res) => {
  const { category, query, page = 1, limit = 12 } = req.query;

  let filters = {};

  // Filter by category
  if (category) {
    filters.category = category;
  }

  // General text search across different fields
  if (query) {
    filters.$or = [
      { name: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ];
  }

  // Pagination setup
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  try {
    // Count documents that match the filters
    const totalProducts = await Product.countDocuments(filters);
    const skip = (parsedPage - 1) * parsedLimit;

    // Retrieve products based on filters, sorted by creation date
    const products = await Product.find(filters)
      .sort({ inStock: -1, createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    // Respond with the result
    res.json({
      products,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalProducts / parsedLimit),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterValues = async (req, res) => {
  try {
    const categories = await Product.find().distinct("category");

    res.json({
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
