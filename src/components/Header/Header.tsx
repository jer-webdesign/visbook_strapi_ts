// src/components/Header/Header.tsx
// This is a React functional component named Header that renders the footer section of a website. 
import './Header.css';
import bookBanner from '/assets/images/visbook-banner.jpg';

export default function Header() {
  return (
    <div className="visbook-banner-title">
      <img src={bookBanner} alt="VisBook Banner" />
      <div className="overlay-text">
        <h1>Your Source for Visual Graphics Mastery</h1>
        <h4>Thanks for visiting VisBook — your creative journey starts here.</h4>
      </div>
    </div>
  );
}

