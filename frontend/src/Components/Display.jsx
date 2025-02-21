import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../axios';
import './css/display.css'; 

const Display = () => {
  const [companyName, setCompanyName] = useState(null);
  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [inventories, setInventories] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('₹ ');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/inventory", { withCredentials: true });
        
        const { companyName, country, inventories } = response.data;

        setCompanyName(companyName);
        setInventories(inventories);

        let totalValue = 0;
        let totalQty = 0;
        let totalItemsCount = 0;

        inventories.forEach(inventory => {
          inventory.items.forEach(item => {
            totalQty += item.quantity;
            totalValue += item.quantity * item.price;
            totalItemsCount += 1;
          });
        });

        setTotalInventoryValue(totalValue);
        setTotalQuantity(totalQty);
        setTotalItems(totalItemsCount);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='display-container'>
      <div className='header'>
        <h1>Inventory Dashboard</h1>
        <h2>{companyName}</h2>
      </div>

      <div className='stats-grid'>
        <div className='stat-card'>
          <h3>Total Inventory Value</h3>
          <p>{currencySymbol}{totalInventoryValue.toLocaleString()}</p>
        </div>
        <div className='stat-card'>
          <h3>Total Quantity</h3>
          <p>{totalQuantity.toLocaleString()}</p>
        </div>
        <div className='stat-card'>
          <h3>Total Items</h3>
          <p>{totalItems.toLocaleString()}</p>
        </div>
      </div>

      <div className='inventory-overview'>
        <h3>Inventory Overview</h3>
        <div className='divider'></div>
        <div className='inventory-list'>
          {inventories.map((inventory, index) => (
            <div key={index} className='inventory-item'>
              <h4>{inventory.name}</h4>
              <p>{inventory.description}</p>
            
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>{currencySymbol}{item.price}</td>
                      <td>{item.category}</td>
                      <td>{currencySymbol}{(item.quantity * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='item-divider'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Display;