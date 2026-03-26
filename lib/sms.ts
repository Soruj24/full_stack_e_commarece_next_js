export async function sendOrderUpdateSMS(phoneNumber: string, orderId: string, status: string) {
  console.log(`[SMS] To: ${phoneNumber}, Order: ${orderId}, Status: ${status}`);
  return Promise.resolve(true);
}
