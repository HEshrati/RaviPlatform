export const zarinpalConfig = () => ({
  merchantId: process.env.ZARINPAL_MERCHANT_ID,
  sandbox: process.env.ZARINPAL_SANDBOX === 'true',
  callbackUrl: process.env.ZARINPAL_CALLBACK_URL || 'http://localhost:3000/api/payments/verify',
  apiUrl: process.env.ZARINPAL_SANDBOX === 'true'
    ? 'https://sandbox.zarinpal.com/pg/v4/payment'
    : 'https://api.zarinpal.com/pg/v4/payment',
});
