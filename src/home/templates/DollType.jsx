import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../static/css/DollType.css';
import { getDollTypes } from '../../service/api.doll'; // Import a function to get doll types

function Dolls() {
  const [dollTypes, setDollTypes] = useState([]);

  useEffect(() => {
    const fetchDollTypes = async () => {
      try {
        const data = await getDollTypes();
        setDollTypes(data.items);
      } catch (error) {
        console.error("Failed to fetch doll types:", error);
      }
    };

    fetchDollTypes();
  }, []);

  return (
    <div className="menu-page">
      {/* Hero Section */}
      <section className="doll-type-hero-section">
        <div className="doll-type-hero-content">
          <h1>Our Doll Types</h1>
          <p>Choose a category to explore our beautiful dolls.</p>
        </div>
      </section>
      {/* Menu Section */}
      <div className="menu-container">
        {Array.isArray(dollTypes) && dollTypes
          .filter((dollType) => dollType.isActive)
          .map((dollType) => (
            <Link
              to={`/doll-type/${dollType.dollTypeID}`}
              className="menu-card"
            >
              <img
                src={dollType.image}
                alt={`${dollType.name} Collection`}
                className="menu-card-img"
              />
              <div className="menu-card-overlay">
                <h2 className="menu-card-title">{dollType.name}</h2>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Dolls;