import { Order } from "@/core/database/models/Order";


export const OrderRepository = {
  async findById(id: string) {
    return Order.findById(id).populate("user", "name email").populate("items.product");
  },

  async findByUser(userId: string) {
    return Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product");
  },

  async create(data: Record<string, unknown>) {
    return Order.create(data);
  },

  async updateById(id: string, data: Record<string, unknown>) {
    return Order.findByIdAndUpdate(id, { $set: data }, { new: true });
  },

  async findByStatus(status: string) {
    return Order.find({ orderStatus: status })
      .sort({ createdAt: -1 })
      .populate("user", "name email");
  },

  async findByPaymentStatus(status: string) {
    return Order.find({ paymentStatus: status })
      .sort({ createdAt: -1 })
      .populate("user", "name email");
  },

  async find(filter: Record<string, unknown> = {}) {
    return Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.product");
  },

  async count(filter: Record<string, unknown> = {}) {
    return Order.countDocuments(filter);
  },

  async getSalesStats(startDate: Date, endDate: Date) {
    return Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
  },
};
