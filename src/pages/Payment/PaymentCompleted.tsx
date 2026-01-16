import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { app } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { X } from 'lucide-react';
import './PaymentCompleted.css';

export default function PaymentCompleted() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore(app);
  const [orderNumber, setOrderNumber] = useState("");
  const cartItems = React.useMemo(() => location.state?.cartItems || [], [location.state]);
  const total = React.useMemo(() => location.state?.total || 0, [location.state]);

  useEffect(() => {
    (async () => {
      if (cartItems.length > 0) {
        try {
          if (currentUser) {
            await addDoc(collection(db, "orders"), {
              userId: currentUser.uid,
              items: cartItems,
              total: parseFloat(total.toFixed(2)),
              createdAt: Timestamp.now(),
              orderNumber,
              paymentMethod: 'Credit Card',
            });
            // Clear user cart in localStorage
            const cartKey = `cart_${currentUser.uid}`;
            localStorage.removeItem(cartKey);
            // Also clear Firestore cart for this user
            const userCartRef = doc(db, "carts", currentUser.uid);
            await setDoc(userCartRef, { items: [] }, { merge: true });
          } else {
            // Guest: clear guest cart
            localStorage.removeItem('cart');
          }
          // Always reset cart counter and refresh UI
          window.dispatchEvent(new Event('cartUpdated'));
          // For signed-in users, also trigger order history refresh
          if (currentUser) {
            window.dispatchEvent(new Event('orderHistoryUpdated'));
          }
        } catch (e) {
          // Optionally handle error
        }
      }
    })();
  }, [currentUser, cartItems, total, orderNumber, db]);

  useEffect(() => {
    // Generate and set order number once per payment
    const randomOrderNumber = () => {
      const rand = () => Math.floor(1000000 + Math.random() * 9000000);
      return `VIS-2025-${rand()}`;
    };
    setOrderNumber(randomOrderNumber());
  }, []);

  // Calculate order details dynamically
  const shipping = location.state?.shipping ?? 0;
  // Calculate 5% tax on subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price_cad * (item.quantity || 1)), 0);
  const tax = Number(((subtotal) * 0.05).toFixed(2));
  const paymentMethod = location.state?.paymentMethod ?? 'Credit Card';
  const email = currentUser?.email || '';

  const totalFinal = subtotal + Number(shipping) + tax;

  const orderDetails = {
    orderNumber: orderNumber ? `#${orderNumber}` : "",
    items: cartItems.map(item => ({
      title: item.title,
      author: item.author,
      type: item.type || '',
      price: `$${(item.price_cad * (item.quantity || 1)).toFixed(2)}`
    })),
    subtotal: `$${subtotal.toFixed(2)}`,
    shipping: `$${Number(shipping).toFixed(2)}`,
    tax: `$${tax.toFixed(2)}`,
    total: `$${totalFinal.toFixed(2)}`,
    paymentMethod,
    email
  };

  return (
    <div className="payment-success-modal-bg">
      <div className="payment-success-modal-container">
        <button
          className="payment-modal-close-btn"
          onClick={() => navigate('/')}
          aria-label="Close"
          style={{ position: 'absolute', top: 16, right: 16 }}
        >
        <X size={22} color="#29a0bb" />
        </button>
        <div className="payment-success-title-row">
          <h2 className="payment-success-title">Payment Successful!</h2>
        </div>
        <p className="payment-success-message">Thank you for your purchase.<br />Your order has been confirmed.</p>
        <div className="payment-success-details">
          <div className="payment-success-details-header">
            <span className="payment-success-details-label">Order Details</span>
            <span className="payment-success-details-number">{orderDetails.orderNumber}</span>
          </div>
          {/* Items */}
          <div className="payment-success-items">
            {cartItems.map((item, idx) => (
              <div key={idx} className="payment-success-item">
                <img
                  src={
                    item.filename
                      ? `${import.meta.env.VITE_STRAPI_MEDIA_URL}/${item.filename}`
                      : item.image
                  }
                  alt={item.title}
                  className="payment-success-item-img"
                />
                <div className="payment-success-item-info">
                  <div className="payment-success-item-title">{item.title}</div>
                  <div className="payment-success-item-author">{item.author}</div>
                  {item.type && <span className="payment-success-item-type">{item.type}</span>}
                </div>
                <span className="payment-success-item-price">${(item.price_cad * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr className="payment-success-divider" />
          <div className="payment-success-row">
            <span>Subtotal:</span>
            <span>{orderDetails.subtotal}</span>
          </div>
          <div className="payment-success-row">
            <span>Shipping:</span>
            <span>{orderDetails.shipping}</span>
          </div>
          <div className="payment-success-row">
            <span>Tax:</span>
            <span>{orderDetails.tax}</span>
          </div>
          <div className="payment-success-total-row">
            <span>Total:</span>
            <span>{orderDetails.total}</span>
          </div>
        </div>
        <button
          className="payment-success-continue-btn"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
