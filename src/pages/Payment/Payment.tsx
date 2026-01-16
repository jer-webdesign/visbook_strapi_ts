// src/pages/Payment/Payment.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], total = 0, paymentMethod = "Credit Card" } = location.state || {};

  // If no cart items, redirect to cart
  React.useEffect(() => {
    if (!cartItems.length) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // Go to PaymentCompleted page on Pay Now
  const handlePayNow = (e) => {
    e.preventDefault();
    navigate('/payment-completed', {
      state: {
        cartItems,
        total,
        paymentMethod
      }
    });
  };

  return (
    <div className="payment-page">
      <div className="payment-form-section">
        <h2>Payment</h2>
        <form className="payment-form" onSubmit={handlePayNow}>
          <div className="payment-methods">
            <label>
              <input type="radio" name="payment-method" value="Credit Card" defaultChecked={paymentMethod === "Credit Card"} />
              Credit card
            </label>
            <label>
              <input type="radio" name="payment-method" value="PayPal" defaultChecked={paymentMethod === "PayPal"} />
              PayPal
            </label>
          </div>
          <div className="credit-card-fields">
            <input type="text" placeholder="Card number" required />
            <input type="text" placeholder="Expiration date (MM / YY)" required />
            <input type="text" placeholder="Security code" required />
            <input type="text" placeholder="Name on card" required />
          </div>
          <div className="billing-address-fields">
            <input type="text" placeholder="Country/Region" required />
            <input type="text" placeholder="First name (optional)" />
            <input type="text" placeholder="Last name (optional)" />
            <input type="text" placeholder="Company (optional)" />
            <input type="text" placeholder="Address" required />
            <input type="text" placeholder="Apartment, suite, etc. (optional)" />
            <input type="text" placeholder="City" required />
            <input type="text" placeholder="Province" required />
            <input type="text" placeholder="Postal code" required />
            <input type="text" placeholder="Phone (optional)" />
          </div>
          <div className="remember-me">
            <label>
              <input type="checkbox" /> Save my information for a faster checkout with a Shop account
            </label>
            <input type="text" placeholder="Mobile phone number" />
          </div>
          <button type="submit" className="pay-now-btn">Pay now</button>
        </form>
      </div>
      <div className="payment-summary-section">
        <h3>Order Summary</h3>
        <div className="payment-cart-items">
          {cartItems.map((item, idx) => (
            <div key={idx} className="payment-cart-item">
              <img
                src={
                  item.filename
                    ? `${import.meta.env.VITE_STRAPI_MEDIA_URL}/${item.filename}`
                    : item.image
                }
                alt={item.title}
                className="payment-cart-img"
              />
              <div>
                <div className="payment-cart-title">{item.title}</div>
                <div className="payment-cart-author">{item.author}</div>
                <div className="payment-cart-price">${item.price_cad.toFixed(2)} CAD</div>
                <div className="payment-cart-qty">Qty: {item.quantity || 1}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="payment-summary-details">
          <div className="payment-summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {/* Shipping row removed as requested */}
          <div className="payment-summary-row payment-summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)} CAD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
