import { Client, Environment, OrdersController, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.PAYPAL_CLIENT_ID || '';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
const environmentMode = (process.env.PAYPAL_ENVIRONMENT || 'sandbox').toLowerCase();

export const isConfigured = Boolean(
  clientId &&
  clientSecret &&
  clientId !== 'YOUR_PAYPAL_CLIENT_ID' &&
  clientSecret !== 'YOUR_PAYPAL_CLIENT_SECRET'
);

let client = null;
let ordersController = null;

if (isConfigured) {
  client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
    environment: environmentMode === 'production' || environmentMode === 'live' 
      ? Environment.Production 
      : Environment.Sandbox,
  });

  ordersController = new OrdersController(client);
  console.log(`[PayPal] ${environmentMode.toUpperCase()} 환경 클라이언트가 성공적으로 초기화되었습니다.`);
} else {
  console.warn('[PayPal] 유효한 PAYPAL_CLIENT_ID 또는 PAYPAL_CLIENT_SECRET이 설정되지 않았습니다. (.env 파일을 확인하세요)');
}

export { client, ordersController, CheckoutPaymentIntent };
