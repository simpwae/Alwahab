import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/',
        '/checkout/',
        '/cart/',
        '/admin/',
      ],
    },
    sitemap: 'https://alwahabmart.com/sitemap.xml',
  };
}
