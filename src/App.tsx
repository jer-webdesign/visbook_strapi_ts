// Import global styles
import './App.css';
// Import main layout components
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
// Import routing utilities from React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import all page components for routing
import BookDetail from './pages/Books/BookDetail';
import Payment from './pages/Payment/Payment';
import Home from './pages/Home/Home';
import Books from './pages/Books/Books';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Cart from './pages/Cart/Cart';
import YourAccount from './pages/Dashboard/YourAccount';
import AccountSettings from './pages/Account/AccountSettings';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import PaymentCompleted from './pages/Payment/PaymentCompleted';

// Main application component
export default function App() {
  return (
    // Set up the router with a base path 
    <Router basename="/visbook_strapi/">
      {/* Navigation bar is always visible at the top */}
      <NavBar />
      {/* Main content area for all routed pages */}
      <div className="main-content">
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />
          {/* Books listing and detail routes */}
          <Route path="/books" element={<Books />} />
          <Route path="/books/:bookID" element={<BookDetail />} /> 
          {/* Informational pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Authentication routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Shopping cart and user account routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<YourAccount />} />    
          <Route path="/account" element={<AccountSettings />} /> 
          <Route path="/account/orders" element={<OrderHistory />} />
          {/* Payment workflow routes */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-completed" element={<PaymentCompleted />} />            
        </Routes>
      </div>
      {/* Footer is always visible at the bottom */}
      <Footer />
    </Router>
  );
}