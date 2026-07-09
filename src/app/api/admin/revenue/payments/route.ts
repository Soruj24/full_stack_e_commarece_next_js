import { NextResponse } from "next/server";

const PAYMENT_BREAKDOWN = [
  {
    method: "stripe",
    label: "Stripe",
    amount: 425000,
    count: 3200,
    percentage: 48,
    avgFee: 2.9,
    feeAmount: 12325,
    netAmount: 412675,
    transactions: [
      { type: "visa", amount: 180000, count: 1350 },
      { type: "mastercard", amount: 145000, count: 1100 },
      { type: "amex", amount: 62000, count: 420 },
      { type: "discover", amount: 38000, count: 330 },
    ],
  },
  {
    method: "paypal",
    label: "PayPal",
    amount: 185000,
    count: 1400,
    percentage: 21,
    avgFee: 3.5,
    feeAmount: 6475,
    netAmount: 178525,
    transactions: [],
  },
  {
    method: "cod",
    label: "Cash on Delivery",
    amount: 124000,
    count: 2100,
    percentage: 14,
    avgFee: 0,
    feeAmount: 0,
    netAmount: 124000,
    transactions: [],
  },
  {
    method: "bkash",
    label: "bKash",
    amount: 89000,
    count: 680,
    percentage: 10,
    avgFee: 1.5,
    feeAmount: 1335,
    netAmount: 87665,
    transactions: [],
  },
  {
    method: "nagad",
    label: "Nagad",
    amount: 45000,
    count: 340,
    percentage: 5,
    avgFee: 1.5,
    feeAmount: 675,
    netAmount: 44325,
    transactions: [],
  },
  {
    method: "rocket",
    label: "Rocket",
    amount: 18000,
    count: 140,
    percentage: 2,
    avgFee: 1.5,
    feeAmount: 270,
    netAmount: 17730,
    transactions: [],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: PAYMENT_BREAKDOWN,
  });
}
