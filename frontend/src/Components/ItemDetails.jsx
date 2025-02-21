import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import inventoryImg from '../assets/images/inventory3.jpeg'; // Import image
import { IoIosArrowBack } from "react-icons/io";
import { axiosInstance } from '../axios';
import './css/itemdetails.css'; // Import the CSS file

const ItemDetails = () => {
  const { itemId } = useParams(); // Access itemId from URL
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axiosInstance.get(`/item/${itemId}`, { withCredentials: true });
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item details:', error);
        setError('An error occurred while fetching item details.');
      }
    };

    fetchItemDetails();
  }, [itemId]);

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await axiosInstance.get('/country', { withCredentials: true });
        setCurrencySymbol(response.data === 'India' ? '₹' : '$');
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    fetchUserCountry();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!item) {
    return <p className="loading-message">Loading...</p>;
  }

  const { itemName, quantity, price, description, inventory } = item;

  return (
    <div className="item-details-container">
      {/* Back to Inventory Button */}
      <button onClick={() => navigate(-1)} className="back-button">
        <IoIosArrowBack /> Back to Inventory
      </button>

      {/* Background Image Section */}
      <div className="background-image">
        <img className="background-img" src={inventoryImg} alt="" />
      </div>

      {/* Item Details Section */}
      <div className="details-card">
        <h2 className="item-name">
          {itemName} <span className="item-type">(Item)</span>
        </h2>
        <p className="description">{description || 'No description available.'}</p>

        {/* Item Info */}
        <h3 className="section-title">Item Information</h3>
        <div className="info-grid">
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Price:</strong> {currencySymbol}{price.toFixed(2)}</p>
          <p><strong>Inventory:</strong> {inventory ? inventory.name || 'Unknown Inventory' : 'Unknown Inventory'}</p>
          <p><strong>Total Cost:</strong> {currencySymbol}{(price * quantity).toFixed(2)}</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-card">
        <h4 className="summary-title">Summary</h4>
        <p>Total Quantity: {quantity}</p>
        <p>Total Cost: {currencySymbol}{(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ItemDetails;
