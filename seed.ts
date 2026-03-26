import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { User } from "./models/User";
import { Category } from "./models/Category";
import { Product } from "./models/Product";
import { Banner } from "./models/Banner";
import bcrypt from "bcryptjs";
import { ICategory } from "./types";

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env file");
}

// --- Data Generators ---

const adjectives = [
  "Premium",
  "Deluxe",
  "Ultra",
  "Smart",
  "Eco-Friendly",
  "Compact",
  "Professional",
  "Advanced",
  "Sleek",
  "Durable",
  "Wireless",
  "Portable",
  "Ergonomic",
  "High-Performance",
  "Vintage",
  "Modern",
  "Luxury",
  "Essential",
  "Pro",
  "Elite",
];
const brands = [
  "TechNova",
  "LuxeLife",
  "EcoGreen",
  "UrbanStyle",
  "FitPro",
  "HomeSense",
  "GamerX",
  "SoundWave",
  "Visionary",
  "PureGlow",
  "SwiftGear",
  "BuildMaster",
  "AutoMate",
  "WriteWay",
  "KitchenPro",
  "DecorArt",
];

function getRandomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProduct(category: ICategory, index: number) {
  const baseName = category.name.split(" ")[0] || "Item"; // Simple noun based on category
  const name = `${getRandomElement(adjectives)} ${baseName} ${getRandomElement(brands)}`;
  const price = parseFloat((Math.random() * 200 + 10).toFixed(2));

  // Use category image as base, or a default fallback
  const productImage = category.image || "/placeholder-product.svg";

  return {
    name: name,
    slug: `${name.toLowerCase().replace(/ /g, "-")}-${index}`,
    description: `Experience the best with our ${name}. Designed for ${category.name.toLowerCase()} enthusiasts, this product offers top-tier performance and durability.`,
    price: price,
    category: category._id,
    stock: getRandomInt(0, 200),
    images: [productImage], // Use the category image for now to ensure visibility
    isFeatured: Math.random() > 0.8, // 20% chance to be featured
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Rating between 3.0 and 5.0
    numReviews: getRandomInt(0, 500),
    tags: [category.slug, "new-arrival", "bestseller"],
    sku: `${(category.slug || "GEN").toUpperCase().substring(0, 3)}-${getRandomInt(1000, 9999)}`,
    brand: getRandomElement(brands),
    shippingOptions: [
      { method: "Standard", price: 0, estimatedDays: "3-5 Business Days" },
      { method: "Express", price: 15, estimatedDays: "1-2 Business Days" },
    ],
  };
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    console.log("Clearing existing data...");

    // Cleanup
    try {
      await User.collection.dropIndex("username_1");
    } catch {}
    try {
      await Product.collection.dropIndex("sku_1");
    } catch {}

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});

    console.log("Creating Users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
      isVerified: true,
      emailVerified: new Date(),
      preferences: {
        emailNotifications: true,
        marketingEmails: false,
        smsNotifications: false,
        inAppNotifications: true,
      },
      loginAttempts: 0,
      loyaltyPoints: 0,
      referralCode: "ADMIN123",
      membershipTier: "platinum",
    });

    await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: hashedPassword,
      role: "user",
      status: "active",
      isVerified: true,
      emailVerified: new Date(),
      preferences: {
        emailNotifications: true,
        marketingEmails: true,
        smsNotifications: false,
        inAppNotifications: true,
      },
      loginAttempts: 0,
      loyaltyPoints: 100,
      referralCode: "USER123",
      membershipTier: "bronze",
    });

    console.log("Creating Categories...");

    // Level 1 Categories
    const electronics = await Category.create({
      name: "Electronics",
      slug: "electronics",
      description: "Gadgets and devices",
      isFeatured: true,
      image: "https://picsum.photos/seed/electronics/800/600",
    });
    const fashion = await Category.create({
      name: "Fashion",
      slug: "fashion",
      description: "Clothing and Apparel",
      isFeatured: true,
      image: "https://picsum.photos/seed/fashion/800/600",
    });
    const home = await Category.create({
      name: "Home & Living",
      slug: "home-living",
      description: "Furniture and Decor",
      isFeatured: true,
      image: "https://picsum.photos/seed/home/800/600",
    });
    const beauty = await Category.create({
      name: "Beauty & Health",
      slug: "beauty-health",
      description: "Cosmetics and Wellness",
      isFeatured: true,
      image: "https://picsum.photos/seed/beauty/800/600",
    });
    const sports = await Category.create({
      name: "Sports & Outdoors",
      slug: "sports-outdoors",
      description: "Gear for active life",
      isFeatured: false,
      image: "https://picsum.photos/seed/sports/800/600",
    });
    const toys = await Category.create({
      name: "Toys & Hobbies",
      slug: "toys-hobbies",
      description: "Fun for all ages",
      isFeatured: false,
      image: "https://picsum.photos/seed/toys/800/600",
    });
    const automotive = await Category.create({
      name: "Automotive",
      slug: "automotive",
      description: "Car accessories",
      isFeatured: false,
      image: "https://picsum.photos/seed/automotive/800/600",
    });

    // Level 2 Categories (Subcategories)
    const smartphones = await Category.create({
      name: "Smartphones",
      slug: "smartphones",
      parent: electronics._id,
      description: "Mobile phones",
      image: "https://picsum.photos/seed/smartphones/800/600",
    });
    const laptops = await Category.create({
      name: "Laptops",
      slug: "laptops",
      parent: electronics._id,
      description: "Computers",
      image: "https://picsum.photos/seed/laptops/800/600",
    });
    const audio = await Category.create({
      name: "Audio",
      slug: "audio",
      parent: electronics._id,
      description: "Headphones and Speakers",
      image: "https://picsum.photos/seed/audio/800/600",
    });

    const menFashion = await Category.create({
      name: "Men's Fashion",
      slug: "mens-fashion",
      parent: fashion._id,
      description: "Men's Clothing",
      image: "https://picsum.photos/seed/mens-fashion/800/600",
    });
    const womenFashion = await Category.create({
      name: "Women's Fashion",
      slug: "womens-fashion",
      parent: fashion._id,
      description: "Women's Clothing",
      image: "https://picsum.photos/seed/womens-fashion/800/600",
    });

    const furniture = await Category.create({
      name: "Furniture",
      slug: "furniture",
      parent: home._id,
      description: "Home Furniture",
      image: "https://picsum.photos/seed/furniture/800/600",
    });
    const decor = await Category.create({
      name: "Decor",
      slug: "decor",
      parent: home._id,
      description: "Home Decoration",
      image: "https://picsum.photos/seed/decor/800/600",
    });

    const allCategories = [
      electronics,
      fashion,
      home,
      beauty,
      sports,
      toys,
      automotive,
      smartphones,
      laptops,
      audio,
      menFashion,
      womenFashion,
      furniture,
      decor,
    ];

    console.log("Creating Products...");

    const productsToCreate = [];

    // 1. Explicitly recreate the Cyberpunk Headset to avoid breaking previous links
    productsToCreate.push({
      _id: "6974e685902080fcc7f02ad8",
      name: "Cyberpunk Headset",
      slug: "cyberpunk-headset",
      description:
        "Immersive audio experience with neon accents and active noise cancellation.",
      price: 299.99,
      category: electronics._id,
      stock: 50,
      images: ["https://picsum.photos/seed/headset/800/600"],
      isFeatured: true,
      rating: 4.8,
      numReviews: 120,
      tags: ["audio", "gaming", "wireless"],
      sku: "CP-HEAD-001",
      brand: "NeonAudio",
      shippingOptions: [
        { method: "Standard", price: 0, estimatedDays: "3-5 Business Days" },
        { method: "Express", price: 15, estimatedDays: "1-2 Business Days" },
      ],
    });

    // 2. Generate ~200 random products
    // Distribute them among categories
    const totalRandomProducts = 200;

    for (let i = 0; i < totalRandomProducts; i++) {
      const randomCategory = getRandomElement(allCategories);
      productsToCreate.push(generateProduct(randomCategory, i));
    }

    // Insert all products
    // We use insertMany for better performance, but since we have a custom _id in one, we need to be careful.
    // However, Mongoose insertMany handles explicit _id fine.

    // Note: Mongoose might throw validation error if _id is duplicate, but we just cleared the DB.
    await Product.insertMany(productsToCreate);

    console.log(`Created ${productsToCreate.length} products.`);

    console.log("Creating Banners...");
    const banners = [
      {
        title: "Summer Sale Extravaganza",
        subtitle: "Up to 50% off on selected items",
        image: "/placeholder-product.svg",
        link: "/products?category=clothing",
        type: "promotion",
        isActive: true,
      },
      {
        title: "New Tech Arrivals",
        subtitle: "Upgrade your gear with the latest gadgets",
        image: "/placeholder-product.svg",
        link: "/products?category=electronics",
        type: "promotion",
        isActive: true,
      },
      {
        title: "Welcome to Our Store",
        subtitle: "Experience the future of shopping",
        image: "/placeholder-product.svg",
        type: "hero",
        isActive: true,
      },
    ];

    await Banner.create(banners);

    console.log("Database seeded successfully!");
    console.log("Admin: admin@example.com / password123");
    console.log("User: user@example.com / password123");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
