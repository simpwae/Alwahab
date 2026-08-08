import { Metadata } from 'next';
import { cache } from 'react';
import { createClient } from '../../../lib/supabase/server';
import React from 'react';

// De-dupes the identical products query that generateMetadata() and the
// layout body below both need for the same request.
const getProduct = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('*').eq('id', id).single();
  return data;
});

// JSON.stringify does not escape '<' or '/', so a product description
// containing "</script><script>..." would otherwise break out of this
// block and execute. Products are admin-write-only, but this is stored XSS
// with full-site blast radius from a single compromised/rogue admin.
function escapeScriptContent(json: string): string {
  return json.replace(/</g, '\\u003c');
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `/product/${id}`,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <>{children}</>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.[0],
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://alwahabmart.com/product/${product.id}`,
      priceCurrency: 'PKR',
      price: product.selling_price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock_qty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(product.review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.review_count,
      }
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeScriptContent(JSON.stringify(jsonLd)) }}
      />
      {children}
    </>
  );
}
