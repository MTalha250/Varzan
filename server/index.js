import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import categoryRoutes from "./routes/category.js";
import contactRoutes from "./routes/contact.js";
import dashboardStatsRoutes from "./routes/dashboardStats.js";
import productRoutes from "./routes/product.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://varzan.co",
      "https://admin.varzan.co",
      "https://varzan.vercel.app",
      "https://varzan-admin.vercel.app",
    ],
  })
);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB connected");
});

db.on("error", (error) => {
  console.log(error);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardStatsRoutes);
app.use("/api/product", productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
