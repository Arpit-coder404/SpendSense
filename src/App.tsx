import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import SplitBills from './pages/SplitBills';
import Groups from './pages/Groups';
import Analytics from './pages/Analytics';
import CampusInsights from './pages/CampusInsights';
import Goals from './pages/Goals';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <FinanceProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="budgets" element={<Budgets />} />
              <Route path="split-bills" element={<SplitBills />} />
              <Route path="groups" element={<Groups />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="campus" element={<CampusInsights />} />
              <Route path="goals" element={<Goals />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </FinanceProvider>
    </BrowserRouter>
  );
};

export default App;

