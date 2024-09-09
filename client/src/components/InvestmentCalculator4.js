import React, { Component } from 'react';
import './InvestmentCalculator.css';

class InvestmentCalculator extends Component {
  state = {
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    futureValue: 0,
    hasInvested: false, 
  };

  principal = 100000;
  rate = 10;

  handleCalculate = () => {
    const { startDate, endDate, hasInvested } = this.state;
    if (hasInvested) {
      // If the user has already invested, show a message and don't proceed
      alert('You have already invested. You cannot invest again.');
      return;
    }
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    const timeInYears = (endTime - startTime) / (1000 * 60 * 60 * 24 * 365);

    const futureValue = this.principal * Math.pow(1 + this.rate / 100, timeInYears);
    this.setState({ futureValue });

    // Send investment data to the server
    const investmentData = {
      productName: 'Education',
      principal: this.principal,
      rate: this.rate,
      startDate,
      endDate,
      interest: futureValue,
    };

    fetch('http://localhost:5000/api/v1/investment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(investmentData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Investment data saved successfully');
          this.setState({ futureValue, hasInvested: true });
        } else {
          console.error('Failed to save investment data:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error while saving investment data:', error);
      });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { startDate, endDate, futureValue } = this.state;

    return (
      <div className="container">
        <h2>Investment Calculator</h2>
        <div className="product-info">
          <img src="/image4.jpg" alt="Product" className="product-image" />
          <p>Name of Product: Education</p>
        </div>
        <div className="input-section">
          <div>
            <label>Principal (initial investment):</label>
            <span className="static-info">{this.principal} rupees</span>
          </div>
          <div>
            <label>Annual Interest Rate (%):</label>
            <span className="static-info">{this.rate}%</span>
          </div>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={this.handleChange}
              className="small-input date-input"
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={this.handleChange}
              className="small-input date-input"
            />
          </div>
        </div>
        <button onClick={this.handleCalculate}>Invest</button>
        <div>
          <p>Future Value: {futureValue.toFixed(2)}</p>
        </div>
      </div>
    );
  }
}

export default InvestmentCalculator;
