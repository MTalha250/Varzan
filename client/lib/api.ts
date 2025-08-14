import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Products
export const fetchProducts = (params = {}) => API.get("/product", { params });
export const fetchProductById = (id: string) => API.get(`/product/${id}`);
export const fetchProductsByCategory = (category: string, params = {}) =>
  API.get(`/product/category/${category}`, { params });
export const fetchFilteredProducts = (params = {}) =>
  API.get("/product/filter", { params });
export const fetchHighlightedProducts = () => API.get("/product/highlighted");

// Categories
export const fetchCategories = () => API.get("/category");

// Contact/Enquiry
export const sendContact = (data: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) => API.post("/contact", data);

// Testimonials
export const fetchTestimonials = (params = {}) =>
  API.get("/testimonial", { params });
export const fetchAllTestimonials = () => API.get("/testimonial/all");

export default API;
