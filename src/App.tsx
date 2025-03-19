import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Designation } from './pages/Designation';
import { PurchaseDetails } from './pages/PurchaseDetails';
import { UsageHistory } from './pages/UsageHistory';
import { UserManagement } from './pages/UserManagement';
import { UserProvider } from './context/UserContext';
import { InventoryProvider } from './context/InventoryContext';
import './App.css';

export function App() {
  return <UserProvider>
      <InventoryProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/designation" element={<Designation />} />
              <Route path="/purchase-details" element={<PurchaseDetails />} />
              <Route path="/usage-history" element={<UsageHistory />} />
              <Route path="/user-management" element={<UserManagement />} />
            </Routes>
          </Layout>
        </Router>
      </InventoryProvider>
    </UserProvider>;
}