import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import InvestmentOptions from './InvestmentOptions';
import InvestmentCalculator from './components/InvestmentCalculator';
import InvestmentCalculator2 from './components/InvestmentCalculator2';
import InvestmentCalculator3 from './components/InvestmentCalculator3';
import InvestmentCalculator4 from './components/InvestmentCalculator4';

import './styles.css'; // Import the CSS file

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/InvestmentOptions" element={<InvestmentOptions />} />
        
        {/* Protected routes */}
        <Route
          path="/components/InvestmentCalculator"
          element={isAuthenticated ? <InvestmentCalculator /> : <Navigate to="/login" />}
        />
        <Route
          path="/components/InvestmentCalculator2"
          element={isAuthenticated ? <InvestmentCalculator2 /> : <Navigate to="/login" />}
        />
        <Route
          path="/components/InvestmentCalculator3"
          element={isAuthenticated ? <InvestmentCalculator3 /> : <Navigate to="/login" />}
        />
        <Route
          path="/components/InvestmentCalculator4"
          element={isAuthenticated ? <InvestmentCalculator4 /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
