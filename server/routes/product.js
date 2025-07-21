import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  getProductForAdmin,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByType,
  getProductsByCategoryAndType,
  filterProducts,
  filterValues,
} from "../controllers/product.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createProduct);
router.get("/", getProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/type/:type", getProductsByType);
router.get("/category/:category/type/:type", getProductsByCategoryAndType);
router.get("/filter", filterProducts);
router.get("/filterValues", filterValues);
router.get("/:id", getProduct);
router.get("/admin/:id", verifyToken, verifyAdmin, getProductForAdmin);
router.put("/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;
