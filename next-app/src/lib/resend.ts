import { Resend } from 'resend';

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY.');
  }
  return new Resend(apiKey);
}

export function getFromEmail() {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error('Resend is not configured. Set RESEND_FROM_EMAIL.');
  }
  return from;
}
