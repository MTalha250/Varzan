import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  filterProducts,
  filterValues,
  getHighlightedProducts,
} from "../controllers/product.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createProduct);
router.get("/", getProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/filter", filterProducts);
router.get("/filterValues", filterValues);
router.get("/highlighted", getHighlightedProducts);
router.get("/:id", getProduct);
router.put("/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;
