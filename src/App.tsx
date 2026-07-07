import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { Home } from './pages/Home';
import { StyleGuide } from './pages/StyleGuide';
import { CategoryListing } from './pages/CategoryListing';
import { SearchResults } from './pages/SearchResults';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { TrackOrder } from './pages/TrackOrder';
export function App() {
  return (
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
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </OrderProvider>
    </CartProvider>);

}