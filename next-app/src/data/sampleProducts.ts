import { Product } from '../types';

export const sampleProducts: Product[] = [
{
  id: 'p1',
  name: 'Wireless Noise-Cancelling Over-Ear Headphones',
  category: 'Electronics',
  brand: 'SoundCore',
  images: [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'],

  sizes: [],
  description:
  'Premium over-ear headphones with active noise cancellation and 40-hour battery life.',
  specs: ['Bluetooth 5.3', '40hr battery', 'ANC', 'USB-C fast charge'],
  originalPrice: 12999,
  sellingPrice: 9199,
  discountPct: 29,
  stockQty: 24,
  lowStockThreshold: 5,
  sku: 'ALW-ELE-0001',
  unitsSold: 132,
  rating: 4.6,
  reviewCount: 88,
  ribbon: 'BestSeller',
  status: 'Active',
  featured: true
},
{
  id: 'p2',
  name: 'Smart Fitness Watch with Heart Rate Monitor',
  category: 'Gadgets',
  brand: 'PulseFit',
  images: [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80'],

  sizes: [],
  description:
  'Track your workouts, sleep, and heart rate with this sleek smartwatch.',
  specs: ['AMOLED display', '7-day battery', 'Waterproof IP68'],
  originalPrice: 8500,
  sellingPrice: 6800,
  discountPct: 20,
  stockQty: 4,
  lowStockThreshold: 5,
  sku: 'ALW-GAD-0002',
  unitsSold: 210,
  rating: 4.4,
  reviewCount: 154,
  ribbon: 'none',
  status: 'Active',
  featured: true
},
{
  id: 'p3',
  name: 'Stainless Steel Insulated Travel Mug 500ml',
  category: 'Home & Kitchen',
  brand: 'BrewWell',
  images: [
  'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80'],

  sizes: [],
  description:
  'Keeps drinks hot for 12 hours and cold for 24. Leak-proof lid.',
  specs: ['500ml capacity', 'Double-wall vacuum', 'BPA-free'],
  originalPrice: 2200,
  sellingPrice: 1650,
  discountPct: 25,
  stockQty: 60,
  lowStockThreshold: 10,
  sku: 'ALW-HOM-0003',
  unitsSold: 340,
  rating: 4.8,
  reviewCount: 201,
  ribbon: 'New',
  status: 'Active',
  featured: false
},
{
  id: 'p4',
  name: 'Leather Card Holder Wallet - Slim Fit',
  category: 'Accessories',
  brand: 'Urban Hide',
  images: [
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'],

  sizes: [],
  description:
  'Genuine leather slim wallet with RFID protection, holds up to 8 cards.',
  specs: ['Genuine leather', 'RFID blocking', '8 card slots'],
  originalPrice: 1800,
  sellingPrice: 1800,
  discountPct: 0,
  stockQty: 0,
  lowStockThreshold: 5,
  sku: 'ALW-ACC-0004',
  unitsSold: 76,
  rating: 4.2,
  reviewCount: 41,
  ribbon: 'none',
  status: 'OutOfStock',
  featured: false
},
{
  id: 'p5',
  name: 'Portable Bluetooth Speaker Waterproof',
  category: 'Electronics',
  brand: 'SoundCore',
  images: [
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80'],

  sizes: [],
  description:
  '360° sound with deep bass, IPX7 waterproof rating, 12-hour playtime.',
  specs: ['IPX7 waterproof', '12hr playtime', 'TWS pairing'],
  originalPrice: 5500,
  sellingPrice: 3999,
  discountPct: 27,
  stockQty: 3,
  lowStockThreshold: 5,
  sku: 'ALW-ELE-0005',
  unitsSold: 189,
  rating: 4.5,
  reviewCount: 97,
  ribbon: 'none',
  status: 'Active',
  featured: true
},
{
  id: 'p6',
  name: 'Ceramic Non-Stick Cookware Set (5-Piece)',
  category: 'Home & Kitchen',
  brand: 'ChefCraft',
  images: [
  'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=600&q=80',
  'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&q=80'],

  sizes: [],
  description: 'Durable ceramic-coated cookware set, oven safe up to 260°C.',
  specs: ['5-piece set', 'Ceramic coating', 'Oven safe 260°C'],
  originalPrice: 15999,
  sellingPrice: 11999,
  discountPct: 25,
  stockQty: 18,
  lowStockThreshold: 5,
  sku: 'ALW-HOM-0006',
  unitsSold: 54,
  rating: 4.7,
  reviewCount: 33,
  ribbon: 'New',
  status: 'Active',
  featured: false
},
{
  id: 'p7',
  name: 'USB-C Fast Charging Hub 7-in-1',
  category: 'Gadgets',
  brand: 'ConnectPro',
  images: [
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
  'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80'],

  sizes: [],
  description:
  '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and PD charging.',
  specs: ['HDMI 4K', '100W PD', 'SD/microSD reader'],
  originalPrice: 4200,
  sellingPrice: 3150,
  discountPct: 25,
  stockQty: 41,
  lowStockThreshold: 10,
  sku: 'ALW-GAD-0007',
  unitsSold: 63,
  rating: 4.3,
  reviewCount: 22,
  ribbon: 'none',
  status: 'Active',
  featured: false
},
{
  id: 'p8',
  name: 'Aromatherapy Essential Oil Diffuser',
  category: 'Lifestyle',
  brand: 'CalmHome',
  images: [
  'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&q=80',
  'https://images.unsplash.com/photo-1596205250210-32d569e5d0e6?w=600&q=80'],

  sizes: [],
  description: 'Ultrasonic diffuser with 7-color LED and auto shut-off.',
  specs: ['300ml tank', '7-color LED', 'Auto shut-off'],
  originalPrice: 3200,
  sellingPrice: 2400,
  discountPct: 25,
  stockQty: 29,
  lowStockThreshold: 5,
  sku: 'ALW-LIF-0008',
  unitsSold: 118,
  rating: 4.6,
  reviewCount: 65,
  ribbon: 'none',
  status: 'Active',
  featured: true
}];