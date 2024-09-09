import React from 'react';
import { Link } from 'react-router-dom';
import './InvestmentOptions.css';
function InvestmentOptions() {
  const maxLimit = 100000;

  return (
    <div className="investment-container">
      <h1 className="investment-heading">FundX</h1>
      <p className="investment-limit">Maximum Investment Limit: ${maxLimit}</p>

      <div className="investment-buttons">
        <Link to="/components/InvestmentCalculator" className="investment-button">
          <img src="image1.jpg" alt="Investment 25000" />
          <span>Food</span>
        </Link>
        <Link to="/components/InvestmentCalculator2" className="investment-button">
          <img src="image2.jpg" alt="Investment 50000" />
          <span>Water</span>
        </Link>
        <Link to="/components/InvestmentCalculator3" className="investment-button">
          <img src="image3.jpg" alt="Investment 75000" />
          <span>Shelter</span>
        </Link>
        <Link to="/components/InvestmentCalculator4" className="investment-button">
          <img src="image4.jpg" alt="Investment 100000" />
          <span>Education</span>
        </Link>
      </div>
    </div>
  );
}

export default InvestmentOptions;
