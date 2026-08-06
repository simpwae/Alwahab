import { Safepay } from '@sfpy/node-sdk';

export function getSafepayClient() {
  const apiKey = process.env.SAFEPAY_API_KEY;
  const v1Secret = process.env.SAFEPAY_V1_SECRET;
  const webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET;
  const environment = (process.env.SAFEPAY_ENVIRONMENT ?? 'sandbox') as ConstructorParameters<
    typeof Safepay
  >[0]['environment'];

  if (!apiKey || !v1Secret || !webhookSecret) {
    throw new Error('Safepay is not configured. Set SAFEPAY_API_KEY, SAFEPAY_V1_SECRET, and SAFEPAY_WEBHOOK_SECRET.');
  }

  return new Safepay({ environment, apiKey, v1Secret, webhookSecret });
}
