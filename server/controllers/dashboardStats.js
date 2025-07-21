import Product from "../models/product.js";
import Order from "../models/order.js";
import Contact from "../models/contact.js";
import Category from "../models/category.js";
import Admin from "../models/admin.js";
import Payment from "../models/payment.js";

export const getDashboardStats = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const completedOrders = await Order.find({ status: "completed" });
    const contactCount = await Contact.countDocuments();
    const categoryCount = await Category.countDocuments();
    const adminCount = await Admin.countDocuments();

    // Payment statistics
    const totalPayments = await Payment.countDocuments();
    const successfulPayments = await Payment.countDocuments({
      status: "succeeded",
    });
    const pendingPayments = await Payment.countDocuments({ status: "pending" });
    const failedPayments = await Payment.countDocuments({ status: "failed" });

    // Revenue calculation
    const revenueResult = await Payment.aggregate([
      { $match: { status: "succeeded" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Monthly revenue (last 12 months)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: "succeeded",
          createdAt: { $gte: oneYearAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      productCount,
      orderCount,
      completedOrders,
      contactCount,
      categoryCount,
      adminCount,
      totalPayments,
      successfulPayments,
      pendingPayments,
      failedPayments,
      totalRevenue,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
