-- Phase 6b seed data: ported directly from next-app/src/data/*.ts so 6c has
-- real data matching what's on screen in the mock app today.

insert into public.products (id, name, category, brand, images, description, specs, original_price, selling_price, discount_pct, stock_qty, low_stock_threshold, sku, units_sold, rating, review_count, ribbon, status, featured) values
('p1', 'Wireless Noise-Cancelling Over-Ear Headphones', 'Electronics', 'SoundCore', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'], 'Premium over-ear headphones with active noise cancellation and 40-hour battery life.', ARRAY['Bluetooth 5.3','40hr battery','ANC','USB-C fast charge'], 12999, 9199, 29, 24, 5, 'ALW-ELE-0001', 132, 4.6, 88, 'BestSeller', 'Active', true),
('p2', 'Smart Fitness Watch with Heart Rate Monitor', 'Gadgets', 'PulseFit', ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80'], 'Track your workouts, sleep, and heart rate with this sleek smartwatch.', ARRAY['AMOLED display','7-day battery','Waterproof IP68'], 8500, 6800, 20, 4, 5, 'ALW-GAD-0002', 210, 4.4, 154, 'none', 'Active', true),
('p3', 'Stainless Steel Insulated Travel Mug 500ml', 'Home & Kitchen', 'BrewWell', ARRAY['https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80','https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80'], 'Keeps drinks hot for 12 hours and cold for 24. Leak-proof lid.', ARRAY['500ml capacity','Double-wall vacuum','BPA-free'], 2200, 1650, 25, 60, 10, 'ALW-HOM-0003', 340, 4.8, 201, 'New', 'Active', false),
('p4', 'Leather Card Holder Wallet - Slim Fit', 'Accessories', 'Urban Hide', ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'], 'Genuine leather slim wallet with RFID protection, holds up to 8 cards.', ARRAY['Genuine leather','RFID blocking','8 card slots'], 1800, 1800, 0, 0, 5, 'ALW-ACC-0004', 76, 4.2, 41, 'none', 'OutOfStock', false),
('p5', 'Portable Bluetooth Speaker Waterproof', 'Electronics', 'SoundCore', ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80','https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80'], '360° sound with deep bass, IPX7 waterproof rating, 12-hour playtime.', ARRAY['IPX7 waterproof','12hr playtime','TWS pairing'], 5500, 3999, 27, 3, 5, 'ALW-ELE-0005', 189, 4.5, 97, 'none', 'Active', true),
('p6', 'Ceramic Non-Stick Cookware Set (5-Piece)', 'Home & Kitchen', 'ChefCraft', ARRAY['https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=600&q=80','https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&q=80'], 'Durable ceramic-coated cookware set, oven safe up to 260°C.', ARRAY['5-piece set','Ceramic coating','Oven safe 260°C'], 15999, 11999, 25, 18, 5, 'ALW-HOM-0006', 54, 4.7, 33, 'New', 'Active', false),
('p7', 'USB-C Fast Charging Hub 7-in-1', 'Gadgets', 'ConnectPro', ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80','https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80'], '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and PD charging.', ARRAY['HDMI 4K','100W PD','SD/microSD reader'], 4200, 3150, 25, 41, 10, 'ALW-GAD-0007', 63, 4.3, 22, 'none', 'Active', false),
('p8', 'Aromatherapy Essential Oil Diffuser', 'Lifestyle', 'CalmHome', ARRAY['https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&q=80','https://images.unsplash.com/photo-1596205250210-32d569e5d0e6?w=600&q=80'], 'Ultrasonic diffuser with 7-color LED and auto shut-off.', ARRAY['300ml tank','7-color LED','Auto shut-off'], 3200, 2400, 25, 29, 5, 'ALW-LIF-0008', 118, 4.6, 65, 'none', 'Active', true);

insert into public.coupons (code, type, value, min_order, usage_limit, valid_from, valid_to, status) values
('WELCOME10', '%', 10, 1000, 500, '2026-01-01', '2026-12-31', 'Active'),
('SAVE500', 'flat', 500, 3000, 200, '2026-01-01', '2026-12-31', 'Active'),
('EXPIRED20', '%', 20, 0, 100, '2025-01-01', '2025-12-31', 'Expired');

insert into public.reviews (id, product_id, customer, rating, title, comment, date, status, verified_purchase) values
(gen_random_uuid(), 'p1', 'Ayesha Khan', 5, 'Exceptional sound quality', 'The noise cancellation is fantastic for my daily commute. Battery easily lasts a full work week. Worth every rupee.', '2026-06-18', 'Approved', true),
(gen_random_uuid(), 'p1', 'Bilal Ahmed', 4, 'Great value', 'Comfortable for long sessions, though the case feels a bit bulky. Sound is crisp and bass is punchy.', '2026-06-10', 'Approved', true),
(gen_random_uuid(), 'p1', 'Sara Malik', 5, null, 'Bought this for my husband and he loves it. Fast delivery too, arrived in 2 days.', '2026-05-29', 'Approved', true),
(gen_random_uuid(), 'p1', 'Omar Farooq', 3, 'Good but not great', 'Sound is good but connection drops occasionally. Otherwise decent for the price point.', '2026-05-14', 'Approved', false),
(gen_random_uuid(), 'p2', 'Hina Raza', 5, 'Perfect fitness companion', 'Accurate heart rate tracking and the battery lasts almost a week. Highly recommend for gym-goers.', '2026-06-20', 'Approved', true),
(gen_random_uuid(), 'p2', 'Zainab Ali', 4, null, 'Great screen and build quality. Companion app could use some improvements.', '2026-06-02', 'Approved', true),
(gen_random_uuid(), 'p3', 'Usman Tariq', 5, 'Keeps drinks hot all day', 'Exactly as described — coffee stayed hot for over 10 hours. Sturdy build too.', '2026-06-15', 'Approved', true),
(gen_random_uuid(), 'p6', 'Mariam Sheikh', 5, 'Kitchen upgrade complete', 'Non-stick coating is excellent, food never sticks even without much oil. Easy to clean.', '2026-06-08', 'Approved', true);

-- Seed orders are left unowned (user_id null) so they work as guest/demo
-- orders via find_guest_order(); 6c's real checkout flow will set user_id
-- for orders placed by a logged-in customer going forward.
insert into public.orders (id, user_id, date, customer, email, phone, shipping_address, coupon_code, subtotal, discount, shipping, total, payment_method, payment_status, fulfillment_status, tracking_number) values
('ALW-10234', null, '2026-06-28', 'Ayesha Khan', 'ayesha.khan@example.com', '0300-1234567', '{"line1":"House 12, Street 4, DHA Phase 5","city":"Lahore"}', null, 9199, 0, 0, 9199, 'COD', 'Pending', 'Shipped', 'TRK-88213PK'),
('ALW-10198', null, '2026-06-20', 'Bilal Ahmed', 'bilal.ahmed@example.com', '0311-9876543', '{"line1":"Flat 3B, Clifton Block 2","city":"Karachi"}', 'SAVE500', 15299, 500, 0, 14799, 'BankTransfer', 'AwaitingVerification', 'Pending', null),
('ALW-10061', null, '2026-06-05', 'Sara Malik', 'sara.malik@example.com', '0321-4567890', '{"line1":"B-45, Gulberg III","city":"Lahore"}', null, 6800, 0, 250, 7050, 'Stripe', 'Paid', 'Delivered', 'TRK-77102PK');

insert into public.order_items (order_id, product_id, name, image, price, qty) values
('ALW-10234', 'p1', 'Wireless Noise-Cancelling Over-Ear Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80', 9199, 1),
('ALW-10198', 'p6', 'Ceramic Non-Stick Cookware Set (5-Piece)', 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=200&q=80', 11999, 1),
('ALW-10198', 'p3', 'Stainless Steel Insulated Travel Mug 500ml', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200&q=80', 1650, 2),
('ALW-10061', 'p2', 'Smart Fitness Watch with Heart Rate Monitor', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80', 6800, 1);

insert into public.store_settings (id, bank_name, account_title, account_number, iban, branch_code, flat_rate, free_shipping_threshold) values
(1, 'Meezan Bank', 'Alwahab Trading Co.', '0123-4567-8901-2345', 'PK36MEZN0001230456789012', '0456', 250, 5000);
