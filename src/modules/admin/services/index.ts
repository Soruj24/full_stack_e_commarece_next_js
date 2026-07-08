export {
  fetchUsers,
  fetchContactMessages,
  fetchSettings,
  fetchAuditLogs,
  fetchActivityData,
  fetchAnalytics,
  deleteUser,
  changeUserRole,
  updateUserStatus,
  deleteContactMessage,
  updateSettings,
  setup2FA,
  verify2FA,
} from "./admin-service";

export type { AdminStats, AdminSettings } from "./admin-service";

export {
  fetchMarketingData,
  createBanner,
  deleteBanner,
  toggleBannerStatus,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
  toggleProductSale,
} from "./marketing-service";
