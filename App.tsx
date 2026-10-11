import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { StorefrontLayout } from './layouts/StorefrontLayout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin imports
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { AdminSetupGuidePage } from './admin/AdminSetupGuidePage';
import { AdminProtectedRoute } from './admin/AdminProtectedRoute';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer-Facing Public Website */}
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/collection" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<CustomerAuthPage />} />
              <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/404" element={<NotFoundPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboardPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/setup"
              element={
                <AdminProtectedRoute>
                  <AdminSetupGuidePage />
                </AdminProtectedRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route element={<StorefrontLayout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
