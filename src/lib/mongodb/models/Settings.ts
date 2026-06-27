import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "YOURAPP",
    },
    contactEmail: {
      type: String,
      default: "admin@yourapp.com",
    },
    allowRegistration: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: "USD",
    },
    stripeEnabled: {
      type: Boolean,
      default: true,
    },
    paypalEnabled: {
      type: Boolean,
      default: true,
    },
    googleAnalyticsId: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
