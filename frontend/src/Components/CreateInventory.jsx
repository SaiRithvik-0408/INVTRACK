import React, { useState } from 'react';
import { axiosInstance } from '../axios';
import './css/createinventory.css'; // Import the CSS file

const CreateInventory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inventoryData = { name, description, items: [] };

    try {
      const response = await axiosInstance.post("/create/inventory", inventoryData, { withCredentials: true });
      console.log('Inventory created:', response.data);

      setName('');
      setDescription('');
      setIsCreated(true);
      setTimeout(() => setIsCreated(false), 3000);
    } catch (error) {
      console.error('Error creating inventory:', error);
    }
  };

  return (
    <div className="create-inventory-container">
      <div className="create-inventory-card">
        <h2 className="create-inventory-title">Create New Inventory</h2>

        {isCreated && (
          <div className="success-message">
            Inventory created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-inventory-form">
          <div>
            <label htmlFor="name" className="input-label">Inventory Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter inventory name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="input-label">Inventory Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              rows="4"
              placeholder="Enter a brief description of the inventory"
            />
          </div>

          <div className="button-container">
            <button type="submit" className="submit-button">
              Create Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInventory;
