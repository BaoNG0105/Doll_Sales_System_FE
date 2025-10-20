import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../static/css/Menu.css'; // Tái sử dụng CSS của trang Menu
import { getDollTypes } from '../api/api.doll'; // Import a function to get doll types

function Dolls() {
  const [dollTypes, setDollTypes] = useState([]);

  useEffect(() => {
    const fetchDollTypes = async () => {
      try {
        const data = await getDollTypes();
        setDollTypes(data);
      } catch (error) {
        console.error("Failed to fetch doll types:", error);
      }
    };

    fetchDollTypes();
  }, []);

  return (
    <div className="menu-page">
      <div className="menu-container">
        {dollTypes.map((dollType) => (
          <Link 
            to={`/doll-type/${dollType.dollTypeID}`} 
            className="menu-card" 
            key={dollType.dollTypeID}
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