import React from "react";
import { Button } from "react-bootstrap";
import ContactUs from "./ContactUs";
import Features from "./Features";
import "./HomePage.css";

// Home component for the landing page
const Home = ({errorMessage, setErrorMessage}) => {
  return (
    <div data-testid="home-container" className="home-container">
      <section className="header-section">
        <div class="flex-right">
          <h2 className="typing">Discover Your Next Adventure</h2>
          {/* <h3>Find Your Ideal Roommate with Ease</h3> */}
          <p>
            Welcome to your next adventure! Whether you're dreaming of a sunny
            beach escape or a mountain retreat, we're here to guide you every
            step of the way.
          </p>
          <Button className="custom-get-started-btn" variant="outline-primary">
            Get Started
          </Button>
        </div>
        <div>
          {" "}
          <img
            className="home-page-img"
            src="/images/home.png"
            alt="Loading..."
          />
        </div>
      </section>
      <Features errorMessage={errorMessage} setErrorMessage={setErrorMessage}></Features>
      <ContactUs></ContactUs>
    </div>
  );
};

export default Home;
