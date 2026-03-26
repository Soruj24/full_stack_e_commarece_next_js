import { dbConnect } from "./config/db";
import { GiftCard } from "./models/GiftCard";

const sampleGiftCards = [
  {
    code: "GIFT-WELCOME-50",
    amount: 50,
    remainingBalance: 50,
    currency: "USD",
    senderName: "Store Admin",
    senderEmail: "admin@store.com",
    recipientName: "New Customer",
    recipientEmail: "new@example.com",
    message: "Welcome to our store! Enjoy this $50 gift card.",
    isActive: true,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: "GIFT-HOLIDAY-100",
    amount: 100,
    remainingBalance: 75,
    currency: "USD",
    senderName: "Holiday Promo",
    senderEmail: "promo@store.com",
    recipientName: "VIP Customer",
    recipientEmail: "vip@example.com",
    message: "Happy Holidays! Thank you for being a loyal customer.",
    isActive: true,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: "GIFT-BDAY-25",
    amount: 25,
    remainingBalance: 0,
    currency: "USD",
    senderName: "Birthday Team",
    senderEmail: "birthday@store.com",
    recipientName: "Birthday Person",
    recipientEmail: "bday@example.com",
    message: "Happy Birthday! Enjoy this special gift.",
    isActive: true,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
];

async function seedGiftCards() {
  try {
    await dbConnect();

    await GiftCard.deleteMany({});
    console.log("Cleared existing gift cards");

    const result = await GiftCard.insertMany(sampleGiftCards);
    console.log(`Inserted ${result.length} gift cards`);

    console.log("Gift card seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Gift card seeding error:", error);
    process.exit(1);
  }
}

seedGiftCards();
