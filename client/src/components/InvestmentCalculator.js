import React, { useState } from 'react';
import './InvestmentCalculator.css';

function InvestmentCalculator() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [futureValue, setFutureValue] = useState(0);
  const [error, setError] = useState(null);
  const [hasInvested, setHasInvested] = useState(false);

  const principal = 25000;
  const rate = 5;

  const handleCalculate = () => {
    if (hasInvested) {
        alert('You have already invested. You cannot invest again.');
        return;
    }

    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    if (endTime <= startTime) {
        setError('End date must be after start date.');
        return;
    }

    const timeInYears = (endTime - startTime) / (1000 * 60 * 60 * 24 * 365);
    const futureValue = principal * Math.pow(1 + rate / 100, timeInYears);
    
    setFutureValue(futureValue);
    setError(null);

    const investmentData = {
        productName: 'Food',
        principal,
        rate,
        startDate,
        endDate,
        interest: futureValue,
    };

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    if (!token) {
        setError('User not authenticated. Please log in.');
        return;
    }

    fetch('http://localhost:5000/api/v1/investment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(investmentData),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then((data) => {
        if (data.success) {
            console.log('Investment data saved successfully');
            setHasInvested(true);
            // Optionally reset state here
        } else {
            setError(data.message);
        }
    })
    .catch((error) => {
        console.error('Error while saving investment data:', error);
        setError('An error occurred while saving investment data. Please try again.');
    });
  };

  return (
    <div className="container">
      <h2>Investment Calculator</h2>
      <div className="product-info">
        <img src="/image1.jpg" alt="Product" className="product-image" />
        <p>Name of Product: Food</p>
      </div>
      <div className="input-section">
        <div>
          <label>Principal (initial investment):</label>
          <span className="static-info">{principal} rupees</span>
        </div>
        <div>
          <label>Annual Interest Rate (%):</label>
          <span className="static-info">{rate}%</span>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="small-input date-input"
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="small-input date-input"
          />
        </div>
      </div>
      <button onClick={handleCalculate} disabled={hasInvested}>Invest</button>
      {error && <p className="error-message">{error}</p>}
      <div>
        <p>Future Value: {futureValue.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default InvestmentCalculator;
