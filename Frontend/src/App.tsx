import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import StockDetail from './pages/StockDetail';
import Navigation from './components/Navigation';

function App() {
  return (
    
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;