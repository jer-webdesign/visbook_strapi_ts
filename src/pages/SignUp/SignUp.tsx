// SignUp.tsx - Updated with Firebase Auth
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./SignUp.css";


export default function SignUp() {
  // Controls the display of the email verification modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  // Stores all form input values
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  // Holds error messages for user feedback
  const [error, setError] = useState("");
  // Indicates if a sign-up process is ongoing
  const [loading, setLoading] = useState(false);
  // Auth functions from context
  const { signup, signInWithGoogle } = useAuth();
  // For navigation after sign-up
  const navigate = useNavigate();

  // Handles input changes for all form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission for email/password sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { displayName, email, password, confirmPassword } = formData;

    // --- Client-side validation for user-friendly feedback ---
    if (!displayName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Simple email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address.");
      return;
    }

    // Password length requirement
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Passwords must match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // --- Attempt to create the user account ---
    try {
      setError("");
      setLoading(true);
      await signup(email, password, displayName);
      setShowVerifyModal(true); // Show modal to prompt email verification
      // navigation will happen after modal closes
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // Handles Google sign-up/sign-in
  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      navigate("/account"); // Redirect to account page after Google sign-in
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // Maps Firebase error codes to friendly messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or sign in.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing the process.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.';
      default:
        return 'An error occurred during sign-up. Please try again.';
    }
  };

  // --- Render the sign-up form and Google sign-in button ---
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Your Account</h2>
        <p className="signup-subtitle">Join our bookstore community</p>
        {/* Show error message if present */}
        {error && <div className="error-message">{error}</div>}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Full Name input */}
          <div className="input-group">
            <label htmlFor="displayName">Full Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              placeholder="Enter your full name"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>
          {/* Email input */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Password input */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* Confirm Password input */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {/* Submit button for email/password sign-up */}
          <button 
            type="submit" 
            className="signup-btn" 
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        {/* Divider for alternative sign-up methods */}
        <div className="divider">
          <span>or</span>
        </div>
        {/* Google sign-in button */}
        <button 
          type="button" 
          className="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img 
            src="assets/images/google-logo.png" 
            alt="Google logo" 
            width="20" 
            height="20" 
            style={{ marginRight: '0.5rem' }}
          />
          Continue with Google
        </button>
        {/* Link to sign-in page for existing users */}
        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
      {/* Modal shown after successful sign-up to prompt email verification */}
      {showVerifyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Email Verification Required</h3>
            <p>A verification email has been sent to your email address. Please verify your email before signing in.</p>
            <button className="modal-btn" onClick={() => { setShowVerifyModal(false); navigate('/signin'); }}>
              Go to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}