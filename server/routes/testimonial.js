import express from "express";
import {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonials,
} from "../controllers/testimonial.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

// Admin-protected create/update/delete
router.post("/", verifyToken, verifyAdmin, createTestimonial);
router.put("/:id", verifyToken, verifyAdmin, updateTestimonial);
router.delete("/:id", verifyToken, verifyAdmin, deleteTestimonial);

// Public list endpoints
router.get("/all", getAllTestimonials);
router.get("/", getTestimonials);
router.get("/:id", getTestimonial);

export default router;
