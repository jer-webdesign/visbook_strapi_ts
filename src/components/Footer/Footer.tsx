// src/components/Footer/Footer.tsx
// This is a React functional component named Footer that renders the footer section of a website. 
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main-row">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>VisBook is your trusted online bookstore, offering a wide selection of books and a seamless shopping experience.</p>
        </div>

        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/visbook_strapi/books">Books</a></li>
            <li><a href="/visbook_strapi/cart">Cart</a></li>
            <li><a href="/visbook_strapi/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section address">
            <h3>Contact</h3>
            <p>Email: support@visbook.ca</p>
            <p>Phone: +1 (403) 456-9153</p>
            <p>Location: 254 Book Lane, Visual City</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} VisBook. All rights reserved.</p>
      </div>
    </footer>
  );
}