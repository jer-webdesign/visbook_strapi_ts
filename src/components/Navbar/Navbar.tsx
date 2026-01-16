import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

// Get the total cart item count for a user from Firestore.
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../firebase";

// Import assets
import visBookLogo from '/assets/images/vblogo.png';
import booksIcon from '/assets/images/icons/books-icon.png';
import aboutIcon from '/assets/images/icons/about-icon.png';
import contactIcon from '/assets/images/icons/contact-icon.png';
import signinIcon from '/assets/images/icons/signin-icon.png';
import cartIcon from '/assets/images/icons/cart-icon.png';

/**
 * Get the total cart item count for a user from Firestore.
 * @param uid - The user's UID
 * @returns The total quantity of items in the user's cart
 */
async function getUserCartCount(uid: string | null): Promise<number> {
  if (!uid) return 0;
  const db = getFirestore(app);
  try {
    const cartDoc = await getDoc(doc(db, "carts", uid));
    if (cartDoc.exists()) {
      const items = cartDoc.data().items || [];
      // Sum up the quantity of each item (default to 1 if not set)
      return items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    }
    return 0;
  } catch (e) {
    console.error("Error fetching user cart count:", e);
    return 0;
  }
}


export default function Navbar() {
  const navigate = useNavigate();
  
  // State management
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  
  // Refs and context
  const userDropdownRef = useRef<HTMLLIElement>(null);
  const { currentUser, userProfile, signout } = useAuth();

  // Always refresh cart counter and login state immediately when currentUser changes or cart is updated
  useEffect(() => {
    const updateCartCount = () => {
      let cartKey = 'cart';
      if (currentUser && currentUser.uid) {
        setIsLoggedIn(true);
        getUserCartCount(currentUser.uid).then(setCartCount);
      } else {
        setIsLoggedIn(false);
        // Only show guest cart if it exists and user is not logged in
        const storedCart = localStorage.getItem(cartKey);
        if (storedCart) {
          const cartArr = JSON.parse(storedCart);
          const total = cartArr.reduce((sum, item) => sum + (item.quantity || 1), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      }
    };
    // Always clear guest cart after logout for safety
    if (!currentUser) {
      localStorage.removeItem('cart');
    }
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [currentUser]);

  // User loading state management
  useEffect(() => {
    if (currentUser !== undefined) {
      setLoadingUser(false);
    }
  }, [currentUser]);

  // Dropdown click outside handler
  useEffect(() => {
    if (!dropdownOpen) return;
    
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  // Event handlers
  const handleLogout = () => {
    // Extra safety: clear guest cart and all user carts from localStorage
    localStorage.removeItem('cart');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cart_')) localStorage.removeItem(key);
    });
    setCartCount(0); // Force reset immediately
    setIsLoggedIn(false); // Hide badge immediately
    signout();
    // Force all listeners (Cart, Navbar) to refresh and initialize
    setTimeout(() => {
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('userLoggedOut'));
      window.location.reload(); // Force browser refresh
    }, 0);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleHamburgerClick = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen && mobileUserDropdownOpen) {
      setMobileUserDropdownOpen(false);
    }
  };

  const handleUserMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileUserDropdownOpen(true);
  };

  const closeMobileMenus = () => {
    setMobileUserDropdownOpen(false);
    setMenuOpen(false);
  };

  // Utility functions
  const getFirstName = () => {
    if (loadingUser) return '';
    if (userProfile?.displayName && userProfile.displayName.trim() !== '') {
      return userProfile.displayName.split(' ')[0];
    }
    if (currentUser?.email && (!currentUser.providerData || currentUser.providerData[0]?.providerId === 'password')) {
      return currentUser.email.split('@')[0];
    }
    return '';
  };

  const isUserLoggedIn = () => {
    return currentUser && currentUser.emailVerified && !loadingUser && getFirstName();
  };

  // Component render methods
  const renderDesktopNavItem = (to, icon, label) => (
    <li key={label}>
      <Link to={to} className="icon-link">
        <img src={icon} alt={label} className="nav-icon" />
        <span className="nav-label">{label}</span>
        <span className="custom-tooltip">{label}</span>
      </Link>
    </li>
  );

  const renderUserDropdown = () => (
    <li
      className="nav-user-dropdown"
      ref={userDropdownRef}
      style={{ position: 'relative', display: 'flex', alignItems: 'stretch', height: '100%' }}
    >
      <button
        className="icon-link user-btn"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        aria-controls="user-dropdown-menu"
        onClick={() => setDropdownOpen((v) => !v)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDropdownOpen(v => !v);
          }
        }}
        tabIndex={0}
        style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}
      >
        {userProfile?.photoURL ? (
          <img src={userProfile.photoURL} alt="User" className="nav-icon profile-avatar-img" />
        ) : (
          <img src={signinIcon} alt="User" className="nav-icon" />
        )}
        <span className="nav-label">Hi, {getFirstName()}</span>
        <span className="custom-tooltip">Hi, {getFirstName()}</span>
      </button>
      <div
        id="user-dropdown-menu"
        className="user-dropdown-menu"
        style={{
          opacity: dropdownOpen ? 1 : 0,
          pointerEvents: dropdownOpen ? 'auto' : 'none',
          left: 0,
          right: 'auto',
          minWidth: 170,
          position: 'absolute',
          top: '110%',
          transition: 'opacity 0.2s',
          zIndex: 100,
          padding: '1rem 0'
        }}
        tabIndex={-1}
        role="menu"
        aria-label="User menu"
      >
      <div className="dropdown-title">
        <Link to="/dashboard" className="dropdown-item" role="menuitem" tabIndex={dropdownOpen ? 0 : -1} onClick={() => setDropdownOpen(false)}>
          Your Account
        </Link>      
        <button className="dropdown-item" role="menuitem" tabIndex={dropdownOpen ? 0 : -1} onMouseDown={e => {
          e.preventDefault();
          setDropdownOpen(false);
          setMenuOpen(false);
          setTimeout(() => handleLogout(), 0);
        }}>
          Log-out
        </button>
       </div> 
      </div>
    </li>
  );

  const renderCartBadge = () => {
    // Only show badge if user is logged in or guest cart exists and has items
    if ((cartCount === 0) || (!isLoggedIn && cartCount === 0)) {
      return (
        <li style={{ position: 'relative' }}>
          <Link to="/cart" className="icon-link cart-link-badge">
            <span className="cart-icon-badge-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
              <img src={cartIcon} alt="Cart" className="nav-icon" />
            </span>
            <span className="nav-label">Cart</span>
            <span className="custom-tooltip">Cart</span>
          </Link>
        </li>
      );
    }
    return (
      <li style={{ position: 'relative' }}>
        <Link to="/cart" className="icon-link cart-link-badge">
          <span className="cart-icon-badge-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <img src={cartIcon} alt="Cart" className="nav-icon" />
            <span className="cart-badge-overlay">{cartCount}</span>
          </span>
          <span className="nav-label">Cart</span>
          <span className="custom-tooltip">Cart</span>
        </Link>
      </li>
    );
  };

  const renderMobileNavItem = (to, icon, label, className = '') => (
    <li className={`mobile-main-menu-item mobile-main-menu-${className || label.toLowerCase()}`}>
      <Link to={to} onClick={() => setMenuOpen(false)} className="full-link mobile-main-menu-link">
        <span className="mobile-main-menu-icon">
          <img src={icon} alt={label} className="nav-icon mobile-main-menu-img" />
        </span>
        <span className="mobile-main-menu-label">{label}</span>
      </Link>
    </li>
  );

  const renderMobileUserButton = () => (
    <li className="mobile-main-menu-item mobile-main-menu-user">
      <button
        type="button"
        className="full-link mobile-user-btn mobile-main-menu-link"
        onClick={handleUserMenuClick}
        aria-haspopup="true"
        aria-expanded={mobileUserDropdownOpen}
        aria-controls="mobile-user-dropdown-menu"
      >
        <span className="mobile-main-menu-icon mobile-main-menu-user-icon">
          {userProfile?.photoURL ? (
            <img src={userProfile.photoURL} alt="User" className="nav-icon mobile-main-menu-img profile-avatar-img" />
          ) : (
            <img src={signinIcon} alt="User" className="nav-icon mobile-main-menu-img" />
          )}
          Hi, {getFirstName()}
        </span>
        <span className="mobile-main-menu-arrow">&#8594;</span>
      </button>
    </li>
  );

  const renderMobileCartItem = () => (
    <li className="mobile-main-menu-item mobile-main-menu-cart">
      <Link to="/cart" onClick={() => setMenuOpen(false)} className="full-link mobile-main-menu-link">
        <span className="mobile-main-menu-icon">
          <span className="cart-icon-badge-wrapper">
            <img src={cartIcon} alt="Cart" className="nav-icon mobile-main-menu-img" />
            {cartCount > 0 && <span className="cart-badge-overlay mobile-main-menu-cart-badge">{cartCount}</span>}
          </span>
        </span>
        <span className="mobile-main-menu-label">Cart</span>
      </Link>
    </li>
  );

  const renderMobileUserDropdown = () => (
    <div className="mobile-user-dropdown-overlay">
      <div className="mobile-user-dropdown-header">
        <button
          aria-label="Back to main menu"
          className="mobile-user-dropdown-back"
          onClick={() => setMobileUserDropdownOpen(false)}
        >
          <span className="mobile-user-dropdown-back-arrow">&#8592;</span>
        </button>
        <span
          className="mobile-user-dropdown-title"
          tabIndex={0}
          role="button"
          onClick={() => setMobileUserDropdownOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') setMobileUserDropdownOpen(false);
          }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          {userProfile?.photoURL ? (
            <img src={userProfile.photoURL} alt="User" className="nav-icon mobile-main-menu-img profile-avatar-img" />
          ) : (
            <img src={signinIcon} alt="User" className="nav-icon mobile-main-menu-img" />
          )}
          Hi, {getFirstName()}
        </span>
      </div>
      <div className="mobile-user-dropdown-menu-list">
        <Link to="/account" className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onClick={closeMobileMenus}>
          Account Settings
        </Link>
        <Link to="/account/orders" className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onClick={closeMobileMenus}>
          Order History
        </Link>
        <button className="dropdown-item mobile-user-dropdown-link" role="menuitem" tabIndex={0} onMouseDown={e => {
          e.preventDefault();
          closeMobileMenus();
          setTimeout(() => handleLogout(), 0);
        }}>
          Log-out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="header">
        <div className="nav-content">
          <div
            className={`hamburger-menu ${menuOpen ? "open" : ""}`}
            onClick={handleHamburgerClick}
          >
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
          </div>
          <div className="nav-row-container">
            <Link to="/" className="home-link">
              <img className="vblogo" src={visBookLogo} alt="VisBook Logo" />
              <h1 className="title">visbook</h1>
            </Link>
            <nav className="desktop-nav">
              <ul>
                {renderDesktopNavItem("/books", booksIcon, "Books")}
                {renderDesktopNavItem("/about", aboutIcon, "About")}
                {renderDesktopNavItem("/contact", contactIcon, "Contact")}
                {isUserLoggedIn() ? renderUserDropdown() : renderDesktopNavItem("/signin", signinIcon, "Sign In")}
                {renderCartBadge()}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className={`mobile-panel${menuOpen || mobileUserDropdownOpen ? " open" : ""}`}>
        <nav className="mobile-nav">
          <ul className="mobile-main-menu-list">
            {renderMobileNavItem("/books", booksIcon, "Books")}
            {renderMobileNavItem("/about", aboutIcon, "About")}
            {renderMobileNavItem("/contact", contactIcon, "Contact")}
            {isUserLoggedIn() ? renderMobileUserButton() : renderMobileNavItem("/signin", signinIcon, "Sign In", "signin")}
            {renderMobileCartItem()}
          </ul>
        </nav>
      </div>

      {mobileUserDropdownOpen && renderMobileUserDropdown()}
    </>
  );
}

