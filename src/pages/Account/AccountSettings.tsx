import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AccountSettings.css";

export default function AccountSettings() {
  const { currentUser, userProfile, updateUserProfile, updateUserPassword, updateUserEmail } = useAuth();
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || "",
    email: currentUser?.email || "",
    homeAddress: userProfile?.homeAddress || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (formData.displayName !== userProfile?.displayName || formData.homeAddress !== userProfile?.homeAddress) {
        await updateUserProfile({ displayName: formData.displayName, homeAddress: formData.homeAddress });
      }
      if (currentUser && formData.email !== currentUser.email) {
        await updateUserEmail(formData.email);
      }
      setMessage("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await updateUserPassword(formData.newPassword);
      setMessage("Password updated successfully!");
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setError("Failed to update password: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Keep formData in sync with userProfile/currentUser changes
  React.useEffect(() => {
    setFormData({
      displayName: userProfile?.displayName || "",
      email: currentUser?.email || "",
      homeAddress: userProfile?.homeAddress || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  }, [userProfile, currentUser]);

  return (
    <div className="account-settings">
      <nav className="breadcrumb-nav">
        <a href="/visbook_strapi/dashboard" className="breadcrumb-link">Your Account</a>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">Account Settings</span>
      </nav>
      <h2>Account Settings</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="settings-columns">
        <div className="settings-section">
          <h3>Profile Information</h3>
          {/* User profile image */}
          <div className="profile-header-row">
            <img
              src={
                currentUser?.photoURL ||
                'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.displayName || 'User') + '&background=46d0ef&color=fff&size=128'
              }
              alt="User profile"
              className="profile-avatar-img"
            />
            <span className="profile-display-name">{formData.displayName || 'User'}</span>
          </div>
          <form onSubmit={handleProfileUpdate}>
            <div className="input-group">
              <label>Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your display name"
              />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
              />
            </div>
            <div className="input-group">
              <label>Home Address</label>
              <input
                type="text"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleChange}
                placeholder="Your home address"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
        <div className="settings-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordUpdate}>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New password"
              />
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
