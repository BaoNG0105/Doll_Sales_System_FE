import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDollModelsByDollTypeId } from '../../service/api.doll';
import '../static/css/Dolls.css'; // Reusing the CSS

function DollModel() {
  const { id } = useParams(); // Get dollTypeID from the URL parameter
  const [dollModels, setDollModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Optional: State for doll type name if you want to display it
  // const [dollTypeName, setDollTypeName] = useState(''); 

  useEffect(() => {
    const fetchDollModels = async () => {
        try {
          setLoading(true);
          const responseData = await getDollModelsByDollTypeId(id);
          console.log('API Response Data:', responseData); // Thêm dòng này để kiểm tra
          if (responseData && responseData.data) {
            setDollModels(responseData.data);
          }
        // If the API also returned the type name, you could set it here.
        // For example: setDollTypeName(data.typeName);
        // Assuming data is an array of models, we'll just show the models.
      } catch (err) {
        setError('Failed to fetch doll models. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDollModels();
  }, [id]); // Re-run the effect if the id changes

  if (loading) {
    return <div className="dolls-page"><p>Loading models...</p></div>;
  }

  if (error) {
    return <div className="dolls-page"><p>{error}</p></div>;
  }

  return (
    <div className="dolls-page">
      {/* You can add a hero section here if you want */}
      <div className="products-grid-container">
        {dollModels.length > 0 ? (
          <div className="products-grid">
            {dollModels.map((model) => (
              <Link to={`/doll-detail/${model.dollModelID}`} key={model.dollModelID} className="doll-product-card">
                <img src={model.image} alt={model.name} className="doll-product-image" />
                <div className="doll-product-info">
                  <h3 className="doll-product-name">{model.name}</h3>
                  <p className="doll-product-description">{model.description}</p>
                  <div className="doll-card-buttons">
                    <button className="add-to-cart-btn">Add to Cart</button>
                    <button className="buy-now-btn">Buy Now</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No models found for this collection.</p>
        )}
      </div>
    </div>
  );
}

export default DollModel;