// About page for VisBook
import React from "react";
import './About.css';

import visbookAbout from '/assets/images/visbook-about.jpg';

export default function About() {
  return (
    <div>
      <main>
        {/* Main about section with image and text */}
        <section className="about">
          <div className="about-container">
            {/* Hero image for the about page */}
            <img src={visbookAbout} alt="About VisBook" className="about-visbook"/>
            <div className="about-text">
              <h2>About</h2>
              {/* Project description */}
              <p>
                <b>VisBook</b> is a visual graphics online bookstore designed to inspire and educate creatives through expertly curated e-books. Specializing in topics like 3D modeling, animation, visual storytelling, and digital design, VisBook serves as a hub for beginners and intermediate artists eager to master the tools of modern visual creation.
              </p>
              {/* Mission statement */}
              <p>
                <b>Mission:</b> <br />
                To offer accessible, high-quality digital resources that empower aspiring visual artists to learn, create, and grow in their craft with confidence.
              </p>
              {/* Vision statement */}
              <p>
                <b>Vision:</b> <br />
                To become the leading online destination for visual graphics learning—nurturing a vibrant community of creators passionate about transforming imagination into compelling digital art.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}