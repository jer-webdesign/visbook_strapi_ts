// Home.tsx
// Import React and key components for the homepage
import React from "react";
import NewBooks from "../Books/NewBooks"; // Shows the latest book releases
import Header from "../../components/Header/Header"; // Main banner/header for the site

export default function Home() {
  return (
    <div>
      <Header />
      <NewBooks />
    </div>
  );
}

