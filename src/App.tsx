import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Designation } from './pages/Designation';
import { PurchaseDetails } from './pages/PurchaseDetails';
import { UsageHistory } from './pages/UsageHistory';
import { UserManagement } from './pages/UserManagement';
import { UserProvider } from './context/UserContext';
import { InventoryProvider } from './context/InventoryContext';
import { Login } from "./pages/Login";

import './App.css';

// Fake authentication function (replace with real authentication logic)
const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

export function App() {
  return (
    <UserProvider>
      <InventoryProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* Protected Routes (Require Authentication) */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Layout><Dashboard /></Layout>} />} />
            <Route path="/inventory" element={<ProtectedRoute element={<Layout><Inventory /></Layout>} />} />
            <Route path="/designation" element={<ProtectedRoute element={<Layout><Designation /></Layout>} />} />
            <Route path="/purchase-details" element={<ProtectedRoute element={<Layout><PurchaseDetails /></Layout>} />} />
            <Route path="/usage-history" element={<ProtectedRoute element={<Layout><UsageHistory /></Layout>} />} />
            <Route path="/user-management" element={<ProtectedRoute element={<Layout><UserManagement /></Layout>} />} />
          </Routes>
        </Router>
      </InventoryProvider>
    </UserProvider>
  );
}
