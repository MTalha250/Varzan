import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  const {
    type,
    name,
    price,
    discount,
    images,
    category,
    inStock,
    sizes,
    description,
    productLink,
    digitalPrint,
    framedPrint,
    highQualityPrints,
    sizeSpecificPricing,
  } = req.body;
  try {
    // Validate productLink for templates
    if (type === "template" && productLink) {
      try {
        new URL(productLink);
      } catch (urlError) {
        return res.status(400).json({
          message:
            "Invalid product link URL format. Please provide a valid URL.",
        });
      }
    }

    // Convert highQualityPrints object to Map if provided
    const highQualityPrintsMap = highQualityPrints
      ? new Map(Object.entries(highQualityPrints))
      : new Map();

    // Convert sizeSpecificPricing object to Map if provided
    const sizeSpecificPricingMap = sizeSpecificPricing
      ? new Map(Object.entries(sizeSpecificPricing))
      : new Map();

    const newProduct = await Product.create({
      type,
      name,
      price,
      discount,
      images,
      category,
      inStock,
      sizes,
      description,
      productLink,
      digitalPrint,
      framedPrint,
      highQualityPrints: highQualityPrintsMap,
      sizeSpecificPricing: sizeSpecificPricingMap,
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
      .select("-productLink")
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
      .select("-productLink")
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

export const getProductsByType = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const { type } = req.params;
  try {
    const totalProducts = await Product.countDocuments({ type });
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find({ type })
      .select("-productLink")
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

export const getProductsByCategoryAndType = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const { category, type } = req.params;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  try {
    const totalProducts = await Product.countDocuments({
      category,
      type,
    });
    const skip = (parsedPage - 1) * parsedLimit;
    const products = await Product.find({
      category,
      type,
    })
      .select("-productLink")
      .sort({
        inStock: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(parsedLimit);
    res.status(200).json({
      products,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalProducts / parsedLimit),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).select("-productLink");
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductForAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    type,
    name,
    price,
    discount,
    images,
    category,
    inStock,
    sizes,
    description,
    productLink,
    digitalPrint,
    framedPrint,
    highQualityPrints,
    sizeSpecificPricing,
  } = req.body;
  try {
    // Validate productLink for templates
    if (type === "template" && productLink) {
      try {
        new URL(productLink);
      } catch (urlError) {
        return res.status(400).json({
          message:
            "Invalid product link URL format. Please provide a valid URL.",
        });
      }
    }

    // Convert highQualityPrints object to Map if provided
    const highQualityPrintsMap = highQualityPrints
      ? new Map(Object.entries(highQualityPrints))
      : undefined;

    // Convert sizeSpecificPricing object to Map if provided
    const sizeSpecificPricingMap = sizeSpecificPricing
      ? new Map(Object.entries(sizeSpecificPricing))
      : undefined;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        type,
        name,
        price,
        discount,
        images,
        category,
        inStock,
        sizes,
        description,
        productLink,
        digitalPrint,
        framedPrint,
        ...(highQualityPrintsMap && {
          highQualityPrints: highQualityPrintsMap,
        }),
        ...(sizeSpecificPricingMap && {
          sizeSpecificPricing: sizeSpecificPricingMap,
        }),
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
  const {
    category,
    type,
    query,
    sizes,
    min,
    max,
    page = 1,
    limit = 12,
  } = req.query;

  let filters = {};

  // Filter by category and type
  if (category) {
    filters.category = category;
  }
  if (type) {
    filters.type = type;
  }

  // General text search across different fields
  if (query) {
    filters.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { type: { $regex: query, $options: "i" } },
    ];
  }

  // Filter by size
  if (sizes) {
    filters.sizes = { $in: sizes.split(",").map((s) => s.trim()) };
  }

  // Price range filtering
  const parsedMin = parseFloat(min);
  const parsedMax = parseFloat(max);
  if (min >= 0 && max > 0) {
    if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
      filters.finalPrice = { $gte: parsedMin, $lte: parsedMax };
    } else if (!isNaN(parsedMin)) {
      filters.finalPrice = { $gte: parsedMin };
    } else if (!isNaN(parsedMax)) {
      filters.finalPrice = { $lte: parsedMax };
    }
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
      .select("-productLink")
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
    const types = await Product.find().distinct("type");
    const sizes = await Product.find().distinct("sizes");
    const maxPrice = await Product.find().sort({ finalPrice: -1 }).limit(1);

    res.json({
      categories,
      types,
      sizes,
      maxPrice: maxPrice.length > 0 ? maxPrice[0].finalPrice : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
