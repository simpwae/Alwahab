import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ProductProvider } from './context/ProductContext';
import { CouponProvider } from './context/CouponContext';
import { ReviewProvider } from './context/ReviewContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { Home } from './pages/Home';
import { StyleGuide } from './pages/StyleGuide';
import { CategoryListing } from './pages/CategoryListing';
import { SearchResults } from './pages/SearchResults';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { TrackOrder } from './pages/TrackOrder';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { NotFound } from './pages/NotFound';
import { AccountWishlist } from './pages/AccountWishlist';
import { AccountDashboard } from './pages/AccountDashboard';
import { AccountOrders } from './pages/AccountOrders';
import { AccountOrderDetail } from './pages/AccountOrderDetail';
import { AccountAddresses } from './pages/AccountAddresses';
import { AccountProfile } from './pages/AccountProfile';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminOrderDetail } from './pages/admin/AdminOrderDetail';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminProductForm } from './pages/admin/AdminProductForm';
import { AdminDiscounts } from './pages/admin/AdminDiscounts';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminCustomerDetail } from './pages/admin/AdminCustomerDetail';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminCouponForm } from './pages/admin/AdminCouponForm';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';
export function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
      <ProductProvider>
      <CouponProvider>
      <ReviewProvider>
      <StoreSettingsProvider>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/style-guide" element={<StyleGuide />} />
                <Route path="/category/:slug" element={<CategoryListing />} />
                <Route path="/deals" element={<CategoryListing />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/order-confirmation/:orderId"
                  element={<OrderConfirmation />} />

                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                  <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/orders"
                  element={
                  <AdminProtectedRoute>
                      <AdminOrders />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/orders/:id"
                  element={
                  <AdminProtectedRoute>
                      <AdminOrderDetail />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/products"
                  element={
                  <AdminProtectedRoute>
                      <AdminProducts />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/products/new"
                  element={
                  <AdminProtectedRoute>
                      <AdminProductForm />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/products/:id/edit"
                  element={
                  <AdminProtectedRoute>
                      <AdminProductForm />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/discounts"
                  element={
                  <AdminProtectedRoute>
                      <AdminDiscounts />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/customers"
                  element={
                  <AdminProtectedRoute>
                      <AdminCustomers />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/customers/:id"
                  element={
                  <AdminProtectedRoute>
                      <AdminCustomerDetail />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/coupons"
                  element={
                  <AdminProtectedRoute>
                      <AdminCoupons />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/coupons/new"
                  element={
                  <AdminProtectedRoute>
                      <AdminCouponForm />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/coupons/:code/edit"
                  element={
                  <AdminProtectedRoute>
                      <AdminCouponForm />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/reviews"
                  element={
                  <AdminProtectedRoute>
                      <AdminReviews />
                    </AdminProtectedRoute>} />
                <Route
                  path="/admin/settings"
                  element={
                  <AdminProtectedRoute>
                      <AdminSettings />
                    </AdminProtectedRoute>} />
                <Route
                  path="/account"
                  element={
                  <ProtectedRoute>
                      <AccountDashboard />
                    </ProtectedRoute>} />

                <Route
                  path="/account/orders"
                  element={
                  <ProtectedRoute>
                      <AccountOrders />
                    </ProtectedRoute>} />

                <Route
                  path="/account/orders/:id"
                  element={
                  <ProtectedRoute>
                      <AccountOrderDetail />
                    </ProtectedRoute>} />

                <Route
                  path="/account/wishlist"
                  element={
                  <ProtectedRoute>
                      <AccountWishlist />
                    </ProtectedRoute>} />

                <Route
                  path="/account/addresses"
                  element={
                  <ProtectedRoute>
                      <AccountAddresses />
                    </ProtectedRoute>} />

                <Route
                  path="/account/profile"
                  element={
                  <ProtectedRoute>
                      <AccountProfile />
                    </ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
      </StoreSettingsProvider>
      </ReviewProvider>
      </CouponProvider>
      </ProductProvider>
      </AdminAuthProvider>
    </AuthProvider>);

}