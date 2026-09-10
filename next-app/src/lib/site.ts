export const SITE_URL = 'https://alwahabmart.com';

// Storefront contact details. Hardcoded per the same decision that put the
// office address in Contact/Footer - there's no admin surface for them and no
// need to change them without a redeploy.
export const STORE_PHONE_DISPLAY = '+92 325 5897659';
export const STORE_PHONE_TEL = '+923255897659';

// wa.me wants digits only, no leading +, no spaces.
export const WHATSAPP_NUMBER = '923255897659';

export function whatsappOrderLink(
product: { name: string; sellingPrice: number },
productUrl: string
): string {
  const message =
  `Assalam o Alaikum, I want to order ${product.name}.\n` +
  `Price: Rs. ${product.sellingPrice.toLocaleString('en-PK')}\n` +
  `Product Link: ${productUrl}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
