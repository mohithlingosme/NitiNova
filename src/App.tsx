import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PricingProvider } from './contexts/PricingContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Research from './pages/Research';
import Compare from './pages/Compare';
import Drafting from './pages/Drafting';
import Cases from './pages/Cases';
import Documents from './pages/Documents';

function App() {
  return (
    <PricingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="research" element={<Research />} />
            <Route path="compare" element={<Compare />} />
            <Route path="drafting" element={<Drafting />} />
            <Route path="cases" element={<Cases />} />
            <Route path="documents" element={<Documents />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </PricingProvider>
  );
}

export default App;
