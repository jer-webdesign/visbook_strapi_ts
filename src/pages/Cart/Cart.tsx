// src/pages/Cart/Cart.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../../firebase";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { Book } from "../../types";


export default function Cart() {
  const [cartItems, setCartItems] = useState<Book[]>([]);
  const { currentUser } = useAuth();
  const db = getFirestore(app);
  const navigate = useNavigate();

  // Strapi API URL - same as in Books.tsx
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const STRAPI_MEDIA_URL = import.meta.env.VITE_STRAPI_MEDIA_URL;


  // Load cart on user change and when cartUpdated event fires
  useEffect(() => {
    const loadCart = async () => {
      let cartKey = "cart";
      if (currentUser && currentUser.uid) {
        // Remove guest cart to prevent merging
        localStorage.removeItem("cart");
        cartKey = `cart_${currentUser.uid}`;
        // Try to load cart from Firestore
        try {
          const cartDoc = await getDoc(doc(db, "carts", currentUser.uid));
          if (cartDoc.exists()) {
            const items = cartDoc.data().items || [];
            setCartItems(items);
            // Also update localStorage for offline support
            localStorage.setItem(cartKey, JSON.stringify(items));
            return;
          }
        } catch (e) {
          // fallback to localStorage if Firestore fails
        }
      } else {
        // Only clear guest cart on explicit logout event, not on every mount
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const items = JSON.parse(storedCart);
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      }
    };
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => {
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, [currentUser, db]);

  // Always refresh cart and counter immediately when currentUser changes
  useEffect(() => {
    let cartKey = "cart";
    if (currentUser && currentUser.uid) {
      // Remove guest cart to prevent merging
      localStorage.removeItem("cart");
      cartKey = `cart_${currentUser.uid}`;
      getDoc(doc(db, "carts", currentUser.uid)).then(cartDoc => {
        if (cartDoc.exists()) {
          const items = cartDoc.data().items || [];
          setCartItems(items);
          localStorage.setItem(cartKey, JSON.stringify(items));
        } else {
          setCartItems([]);
        }
      });
    } else {
      // Guest: use localStorage
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        const items = JSON.parse(storedCart);
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    }
  }, [currentUser, db]);

  // Track cart count for events
  useEffect(() => {
    if (currentUser || (!currentUser && cartItems.length > 0)) {
      const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      // Dispatch event with the count for navbar
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count } }));
    }
  }, [cartItems, currentUser]);

  // Enforce cart reset on logout for extra safety
  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("cart");
      setCartItems([]);
    };
    window.addEventListener('userLoggedOut', handleLogout);
    return () => {
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);


  // Handle quantity change
  const saveCartToFirestore = async (items) => {
    if (currentUser && currentUser.uid) {
      try {
        await setDoc(doc(db, "carts", currentUser.uid), { items });
      } catch (e) {
        // handle error (optional)
      }
    }
  };

  const handleQuantityChange = (index, delta) => {
    setCartItems(prevItems => {
      const updated = prevItems.map((item, i) => {
        if (i === index) {
          const newQty = (item.quantity || 1) + delta;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      });
      if (currentUser && currentUser.uid) {
        const cartKey = `cart_${currentUser.uid}`;
        localStorage.setItem(cartKey, JSON.stringify(updated));
        saveCartToFirestore(updated);
      } else {
        localStorage.setItem("cart", JSON.stringify(updated));
      }
      window.dispatchEvent(new Event('cartUpdated'));
      return updated;
    });
  };

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    if (currentUser && currentUser.uid) {
      const cartKey = `cart_${currentUser.uid}`;
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      saveCartToFirestore(updatedCart);
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + ((item.price_cad || item.price || 0) * (item.quantity || 1)), 0);

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Navigate to payment page (simulate payment page route)
    navigate('/payment', { state: { cartItems, total } });
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="cart-empty-message">
          <p>Your cart is empty.</p>
          <button
            className="continue-shopping-btn"
            style={{ display: 'block', margin: '2rem auto 15rem auto' }}
            onClick={() => navigate('/books')}
          >
            Continue shopping
          </button>
        </div>
      ) : (
        <div>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-details">
                  <img
                    src={
                      item.filename
                        ? `${STRAPI_MEDIA_URL}/${item.filename}`
                        : `${STRAPI_URL}${item.image || ""}`
                    }
                    alt={item.title}
                  />
                  <div>
                    <h2>{item.title}</h2>
                    <p>Author: {item.author}</p>
                    <p>Price: ${(item.price_cad || item.price || 0).toFixed(2)} CAD</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                    </div>
                  </div>
                </div>
                <button className="remove-button" onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>Total: ${total.toFixed(2)} CAD</p>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate('/books')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
      {/* Modal removed: guest users can now proceed to checkout */}
    </div>
  );
}
