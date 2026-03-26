import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env file");
}

interface GlobalMongoose {
  mongoose?: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

let cached = (global as GlobalMongoose).mongoose;

if (!cached) {
  cached = (global as GlobalMongoose).mongoose = { conn: null, promise: null };
}

export async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB connection error:", error);
      cached!.promise = null;
      throw error;
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
