import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { axiosInstance } from '../axios';
import './css/updateinventory.css'; // Import CSS file

const UpdateInventory = () => {
    const [inventories, setInventories] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState('');
    const [items, setItems] = useState([]);
    const [editItemId, setEditItemId] = useState(null);
    const [updatedItemName, setUpdatedItemName] = useState('');
    const [updatedItemPrice, setUpdatedItemPrice] = useState(0);
    const [updatedItemQuantity, setUpdatedItemQuantity] = useState(0);
    const [updatedItemCategory, setUpdatedItemCategory] = useState('');
    const [userCountry, setUserCountry] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserCountry = async () => {
            try {
                const response = await axiosInstance.get('/country', { withCredentials: true });
                setUserCountry(response.data);
            } catch (error) {
                console.error('Error fetching user country:', error);
                setUserCountry('');
            }
        };
        fetchUserCountry();
    }, []);

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await axiosInstance.get('/inventories', { withCredentials: true });
                setInventories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching inventories:', error);
                setLoading(false);
            }
        };
        fetchInventories();
    }, []);

    const fetchItems = async () => {
        if (selectedInventory) {
            try {
                const response = await axiosInstance.get(`/inventories/${selectedInventory}/items`);
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        } else {
            setItems([]);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [selectedInventory]);

    const handleEditClick = (item) => {
        setEditItemId(item._id);
        setUpdatedItemName(item.itemName);
        setUpdatedItemPrice(item.price);
        setUpdatedItemQuantity(item.quantity);
        setUpdatedItemCategory(item.category);
    };

    const handleSaveItem = async (itemId) => {
        try {
            await axiosInstance.put(`/items/${itemId}`, {
                name: updatedItemName,
                price: updatedItemPrice,
                quantity: updatedItemQuantity,
                category: updatedItemCategory,
            });
            resetEditState();
            await fetchItems();
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axiosInstance.delete(`/items/${itemId}`);
            setItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const resetEditState = () => {
        setEditItemId(null);
        setUpdatedItemName('');
        setUpdatedItemPrice(0);
        setUpdatedItemQuantity(0);
        setUpdatedItemCategory('');
    };

    const formatPrice = (price) => {
        return userCountry === 'India' ? `₹${price}` : `$${price}`;
    };

    return (
        <div className="update-inventory-container">
            <h2 className="title">Update Items</h2>

            {loading ? ( 
                <p>Loading...</p>
            ) : (
                <>
                    <select onChange={(e) => setSelectedInventory(e.target.value)} value={selectedInventory} className="inventory-select">
                        <option value="">Select Inventory</option>
                        {inventories.map((inventory) => (
                            <option key={inventory._id} value={inventory._id}>
                                {inventory.name}
                            </option>
                        ))}
                    </select>

                    {items.length > 0 ? (
                        <div>
                            <h3 className="sub-title">Items in Selected Inventory</h3>
                            <table className="item-table">
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item._id}>
                                            {editItemId === item._id ? (
                                                <>
                                                    <td><input type="text" value={updatedItemName} onChange={(e) => setUpdatedItemName(e.target.value)} /></td>
                                                    <td><input type="number" value={updatedItemQuantity} onChange={(e) => setUpdatedItemQuantity(Number(e.target.value))} /></td>
                                                    <td><input type="number" value={updatedItemPrice} onChange={(e) => setUpdatedItemPrice(Number(e.target.value))} /></td>
                                                    <td><input type="text" value={updatedItemCategory} onChange={(e) => setUpdatedItemCategory(e.target.value)} /></td>
                                                    <td>
                                                        <button onClick={() => handleSaveItem(item._id)} className="save-button">Save</button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{item.itemName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatPrice(item.price)}</td>
                                                    <td>{item.category}</td>
                                                    <td>
                                                        <div className='button-group'>
                                                            <button onClick={() => handleEditClick(item)} className="edit-button">
                                                                <FaEdit /> Update
                                                            </button>
                                                            <button onClick={() => handleDeleteItem(item._id)} className="delete-button">
                                                                <MdDelete /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className='no-items'>No items found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default UpdateInventory;
