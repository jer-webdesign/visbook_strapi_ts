
import React from 'react';
import { Link } from 'react-router-dom';
// import OrderHistory from '../OrderHistory/OrderHistory';
import './YourAccount.css';

// Font Awesome CDN should be included in index.html or public/index.html

export default function YourAccount() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Account</h2>
      <div className="dashboard-sections">
        <div className="dashboard-card">
          <Link to="/account" className="dashboard-section">
            <div className="dashboard-card-icon">
              <i className="fa-solid fa-user-gear" aria-hidden="true"></i>
            </div>
            <h3>Account Settings</h3>
            <p>Manage your personal information, email, and preferences.</p>
          </Link>
        </div>
        <div className="dashboard-card">
          <Link to="/account/orders" className="dashboard-section">
            <div className="dashboard-card-icon">
              <i className="fa-solid fa-box-open" aria-hidden="true"></i>
            </div>
            <h3>Your Orders</h3>
            <p>View your past purchases.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
