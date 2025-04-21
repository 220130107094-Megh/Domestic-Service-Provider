import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

function environment() {
  return new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export default client;
