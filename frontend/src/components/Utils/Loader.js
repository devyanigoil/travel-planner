// src/components/Loader.js
import React from 'react';
import './Loader.css';  // You can style the loader here

const Loader = () => {
  return (
    <div className="loader-container">
      <img src="/loader.gif" alt="Loading..." />
    </div>
  );
};

export default Loader;
