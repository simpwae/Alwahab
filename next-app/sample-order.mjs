import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://syskdhrzcrvaligqirvg.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data, error } = await supabase.rpc('place_order', {
  p_user_id: null,
  p_customer: 'Ahmad Khan',
  p_email: 'alwahabmart5@gmail.com',
  p_phone: '03215897659',
  p_shipping_address: { line1: 'House 22, Street 5, Hayatabad', city: 'Peshawar' },
  p_coupon_code: null,
  p_subtotal: 2400,
  p_discount: 0,
  p_shipping: 250,
  p_total: 2650,
  p_payment_method: 'COD',
  p_payment_status: 'Pending',
  p_receipt_image: null,
  p_items: [{
    product_id: 'p1784570936822',
    name: 'One Step Hot Air Brush 3-in-1 Dryer, Straightener & Comb',
    image: 'https://cdn.shopify.com/s/files/1/0509/9107/1390/files/160a19061551d806fa610cc7573c37c9_480x480.png?v=1662469602',
    price: 2400,
    qty: 1,
    size: null
  }]
});

if (error) {
  console.log('ORDER_ERROR', error.message);
} else {
  console.log('ORDER_ID', data.id);
}
