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

export {
  fetchSalesSummary,
  fetchSalesByDay,
  fetchSalesByProduct,
  fetchSalesByCategory,
} from "./sales-service";

export {
  fetchRevenueSummary,
  fetchRevenueByPaymentMethod,
  fetchRevenueForecast,
} from "./revenue-service";

export {
  fetchNotifications,
  createNotification,
  deleteNotification,
  fetchNotificationTemplates,
  markNotificationRead,
} from "./notification-service";

export {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  fetchPermissions,
} from "./role-service";

export {
  fetchReports,
  generateReport,
  deleteReport,
} from "./report-service";
