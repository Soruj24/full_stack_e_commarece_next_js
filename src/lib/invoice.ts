import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPrice, convertPrice } from "@/lib/localization";

export const generateInvoicePDF = (order: {
  _id: string;
  createdAt: string | Date;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingPrice: number;
  taxPrice: number;
  currency?: string;
}) => {
  const doc = new jsPDF();
  const margin = 20;
  const curr = order.currency || "USD";

  // Header
  doc.setFontSize(20);
  doc.text("INVOICE", margin, margin);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Order ID: ${order._id}`, margin, margin + 10);
  doc.text(
    `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    margin,
    margin + 15,
  );

  // Billing/Shipping Info
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text("Shipping Address:", margin, margin + 30);
  doc.setFontSize(10);
  doc.text(order.shippingAddress.street, margin, margin + 35);
  doc.text(
    `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
    margin,
    margin + 40,
  );
  doc.text(order.shippingAddress.country, margin, margin + 45);

  // Items Table
  const tableData = (order.items || []).map((item) => [
    item.name,
    item.quantity.toString(),
    formatPrice(convertPrice(item.price, curr), curr),
    formatPrice(convertPrice(item.quantity * item.price, curr), curr),
  ]);

  autoTable(doc, {
    startY: margin + 55,
    head: [["Product", "Qty", "Unit Price", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [0, 0, 0] },
  });

  // Summary
  const finalY =
    (doc as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ||
    margin + 55;
  const summaryX = 130;
  const summarySpacing = 8;
  const startSummaryY = finalY + 15;

  doc.setFontSize(10);
  doc.setTextColor(0);

  doc.text(`Subtotal:`, summaryX, startSummaryY);
  doc.text(formatPrice(convertPrice(order.totalAmount - order.shippingPrice - order.taxPrice, curr), curr), 190, startSummaryY, { align: "right" });

  doc.text(`Shipping:`, summaryX, startSummaryY + summarySpacing);
  doc.text(formatPrice(convertPrice(order.shippingPrice, curr), curr), 190, startSummaryY + summarySpacing, { align: "right" });

  doc.text(`Tax:`, summaryX, startSummaryY + summarySpacing * 2);
  doc.text(formatPrice(convertPrice(order.taxPrice, curr), curr), 190, startSummaryY + summarySpacing * 2, { align: "right" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total:`, summaryX, startSummaryY + summarySpacing * 3 + 5);
  doc.text(formatPrice(convertPrice(order.totalAmount, curr), curr), 190, startSummaryY + summarySpacing * 3 + 5, { align: "right" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Thank you for your business!", margin, 280);

  doc.save(`Invoice-${order._id}.pdf`);
};
