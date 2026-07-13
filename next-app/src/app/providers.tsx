"use client";

import { AuthProvider } from "../context/AuthContext";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { ProductProvider } from "../context/ProductContext";
import { CouponProvider } from "../context/CouponContext";
import { ReviewProvider } from "../context/ReviewContext";
import { StoreSettingsProvider } from "../context/StoreSettingsContext";
import { WishlistProvider } from "../context/WishlistContext";
import { CartProvider } from "../context/CartContext";
import { OrderProvider } from "../context/OrderContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <ProductProvider>
          <CouponProvider>
            <ReviewProvider>
              <StoreSettingsProvider>
                <WishlistProvider>
                  <CartProvider>
                    <OrderProvider>{children}</OrderProvider>
                  </CartProvider>
                </WishlistProvider>
              </StoreSettingsProvider>
            </ReviewProvider>
          </CouponProvider>
        </ProductProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
