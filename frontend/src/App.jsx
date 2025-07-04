import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductListPage from "./pages/ProductListPage";
import ProductFormPage from "./pages/ProductFormPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryListPage from "./pages/CategoryListPage";
import CategoryFormPage from "./pages/CategoryFormPage";
import SupplierListPage from "./pages/SupplierListPage";
import SupplierFormPage from "./pages/SupplierFormPage";
import TransactionListPage from "./pages/TransactionListPage";
import PurchasePage from "./pages/PurchasePage";
import SellPage from "./pages/SellPage";
import UserProfilePage from "./pages/UserProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Product Routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Category Routes (Admin Only) */}
        <Route
          path="/categories"
          element={
            <ProtectedRoute requireAdmin={true}>
              <CategoryListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories/new"
          element={
            <ProtectedRoute requireAdmin={true}>
              <CategoryFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories/edit/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <CategoryFormPage />
            </ProtectedRoute>
          }
        />

        {/* Supplier Routes */}
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <SupplierListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers/new"
          element={
            <ProtectedRoute>
              <SupplierFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers/edit/:id"
          element={
            <ProtectedRoute>
              <SupplierFormPage />
            </ProtectedRoute>
          }
        />

        {/* Transaction Routes */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase"
          element={
            <ProtectedRoute>
              <PurchasePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <SellPage />
            </ProtectedRoute>
          }
        />

        {/* User Profile and Settings Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;







