import React, { useState } from 'react';
import './register-styles.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that all required fields are included
    const { name, email, otp, password, confirmPassword } = formData;

    if (!name || !email || !otp || !password || !confirmPassword) {
        setError('Please fill all fields.');
        return;
    }

    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/v1/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log('Registration successful!');
            alert('Registration Successful');
            navigate('/InvestmentOptions');
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Registration failed.');
            console.error('Registration failed:', errorData.message);
        }
    } catch (error) {
        alert('Registration error');
        console.error('Error during registration:', error);
    }
};

  const getOTP = async (e) => {
    e.preventDefault();

    console.log("Sending OTP for email:", formData.email); // Debugging

    try {
      const response = await fetch('http://localhost:5000/api/v1/sendotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        console.log('OTP sent successfully!');
        setError('OTP Sent Successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Cannot send OTP');
        console.error('Error occurred while sending OTP:', errorData.message);
      }
    } catch (error) {
      setError('Cannot send OTP');
      console.error('Error occurred while sending OTP:', error);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Johndoe@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="button"
          className="register-button"
          onClick={getOTP}
        >
          Get OTP
        </button>
        <div className="form-group">
          <label htmlFor="otp">OTP</label>
          <input
            type="text"  // Changed from "email" to "text"
            id="otp"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="**********"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="**********"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
