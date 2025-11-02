import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDollModelsByDollTypeId, getDollTypes } from '../../service/api.doll';
import Swal from 'sweetalert2';
import '../static/css/Dolls.css';

function DollModel() {
  const { typeId } = useParams(); // Changed from id to typeId
  const navigate = useNavigate();
  const [dollModels, setDollModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkDollTypeActive = async () => {
      try {
        const dollTypesData = await getDollTypes();
        const dollType = dollTypesData.items.find((type) => String(type.dollTypeID) === String(typeId)); // Use typeId
        if (!dollType || !dollType.isActive) {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'This doll type is inactive or does not exist!',
          }).then(() => {
            navigate('/doll-type');
          });
          return;
        }
        // Only fetch models if doll type is active
        const responseData = await getDollModelsByDollTypeId(typeId); // Use typeId
        setDollModels(responseData);
      } catch (err) {
        console.error("Failed to fetch doll models:", err);
        setError('Failed to fetch doll models. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (typeId) { // Use typeId
      checkDollTypeActive();
    }
  }, [typeId, navigate]); // Use typeId

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dolls-page">
      {/* Optional: Hero section for the doll type */}
      <section className="dolls-hero-section" style={{ backgroundImage: `url(${dollModels[0]?.image || ''})` }}>
        <div className="dolls-hero-content">
          {/* You can dynamically set the title here if you fetch the doll type name */}
          <h1>Explore Doll Models</h1>
          <p>Find the perfect companion from our exclusive collection.</p>
        </div>
      </section>

      <main className="products-grid-container">
        <div className="products-grid">
          {dollModels
            .filter((doll) => doll.isActive)
            .map((doll) => (
              <Link to={`/doll-type/${typeId}/doll-model/${doll.dollModelID}`} key={doll.dollModelID} className="doll-product-card">
                <img src={doll.image} alt={doll.name} className="doll-product-image" />
                <div className="doll-product-info">
                  <h3 className="doll-product-name">{doll.name}</h3>
                  <p className="doll-product-description">
                    {doll.description || 'No description available.'}
                  </p>
                  {typeof doll.price === 'number' && (
                    <div className="doll-product-price">${doll.price.toFixed(2)}</div>
                  )}
                  <div className="doll-card-buttons">
                    {/* Single "View Details" button */}
                    <button className="buy-now-btn">View Details</button>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}

export default DollModel;