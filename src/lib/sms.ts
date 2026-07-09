export async function sendOrderUpdateSMS(phoneNumber: string, orderId: string, status: string) {
  // TODO: Remove console.log or replace with proper logging
  console.log(`[SMS] To: ${phoneNumber}, Order: ${orderId}, Status: ${status}`);
  return Promise.resolve(true);
}
