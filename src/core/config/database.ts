import mongoose from "mongoose";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Register all models to ensure populate() works across routes
import "@/core/database/models/User";
import "@/core/database/models/Product";
import "@/core/database/models/Category";
import "@/core/database/models/Brand";
import "@/core/database/models/Order";
import "@/core/database/models/Coupon";
import "@/core/database/models/Bundle";
import "@/core/database/models/Banner";
import "@/core/database/models/GiftCard";
import "@/core/database/models/Return";
import "@/core/database/models/Vendor";
import "@/core/database/models/AbandonedCart";
import "@/core/database/models/Notification";
import "@/core/database/models/SupportTicket";
import "@/core/database/models/StockAlert";
import "@/core/database/models/PriceHistory";
import "@/core/database/models/Payout";
import "@/core/database/models/Settings";
import "@/core/database/models/Session";
import "@/core/database/models/Token";
import "@/core/database/models/LoginHistory";
import "@/core/database/models/PopularSearch";
import "@/core/database/models/Faq";
import "@/core/database/models/ContactMessage";


interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function dbConnect() {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise) {
    return cached.promise;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env");
  }

  cached.promise = mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    connectTimeoutMS: 30000,
  }).then((mongoose) => {
    console.log("✅ MongoDB connected");
    cached.conn = mongoose;
    return mongoose;
  }).catch((err) => {
    cached.promise = null;
    throw err;
  });

  return cached.promise;
}
