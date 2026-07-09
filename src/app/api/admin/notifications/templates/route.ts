import { NextResponse } from "next/server";

const TEMPLATES = [
  {
    id: "tmpl_001",
    name: "Order Confirmation",
    type: "order",
    subject: "Order #{orderNumber} Confirmed",
    body: "Dear {customerName},\n\nYour order #{orderNumber} has been confirmed and is being processed.\n\nTotal: ${total}\nEstimated Delivery: {estimatedDelivery}\n\nThank you for shopping with us!",
    variables: ["orderNumber", "customerName", "total", "estimatedDelivery"],
    isActive: true,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-06-20T14:30:00Z",
  },
  {
    id: "tmpl_002",
    name: "Shipping Update",
    type: "order",
    subject: "Your Order #{orderNumber} Has Shipped",
    body: "Dear {customerName},\n\nYour order #{orderNumber} has shipped!\n\nTracking: {trackingNumber}\nCarrier: {carrier}\n\nTrack your package: {trackingUrl}",
    variables: ["orderNumber", "customerName", "trackingNumber", "carrier", "trackingUrl"],
    isActive: true,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-05-10T09:00:00Z",
  },
  {
    id: "tmpl_003",
    name: "Password Reset",
    type: "auth",
    subject: "Reset Your Password",
    body: "Hi {customerName},\n\nClick the link below to reset your password:\n\n{resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.",
    variables: ["customerName", "resetLink"],
    isActive: true,
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-02-01T08:00:00Z",
  },
  {
    id: "tmpl_004",
    name: "Welcome Email",
    type: "auth",
    subject: "Welcome to {siteName}!",
    body: "Hi {customerName},\n\nWelcome to {siteName}! We're excited to have you.\n\nGet started by exploring our latest products:\n\n{exploreLink}\n\nEnjoy {discount}% off your first purchase with code: {couponCode}",
    variables: ["siteName", "customerName", "exploreLink", "discount", "couponCode"],
    isActive: true,
    createdAt: "2026-01-10T12:00:00Z",
    updatedAt: "2026-04-15T16:00:00Z",
  },
  {
    id: "tmpl_005",
    name: "Refund Processed",
    type: "order",
    subject: "Refund Processed for Order #{orderNumber}",
    body: "Dear {customerName},\n\nYour refund of ${amount} for order #{orderNumber} has been processed.\n\nIt may take 5-10 business days to appear on your statement.\n\nRefund Method: {paymentMethod}",
    variables: ["orderNumber", "customerName", "amount", "paymentMethod"],
    isActive: true,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-06-25T11:00:00Z",
  },
  {
    id: "tmpl_006",
    name: "Abandoned Cart Reminder",
    type: "marketing",
    subject: "You left something in your cart!",
    body: "Hi {customerName},\n\nYou have items waiting in your cart:\n\n{cartItems}\n\nComplete your purchase now and get {discount}% off!\n\n{checkoutLink}",
    variables: ["customerName", "cartItems", "discount", "checkoutLink"],
    isActive: false,
    createdAt: "2026-04-01T10:00:00Z",
    updatedAt: "2026-06-01T10:00:00Z",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      templates: TEMPLATES,
      totalCount: TEMPLATES.length,
      activeCount: TEMPLATES.filter((t) => t.isActive).length,
    },
  });
}
