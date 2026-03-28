import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

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
