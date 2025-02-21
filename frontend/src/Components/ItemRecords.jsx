import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../axios';
import './admincss/itemrecords.css'; // Import the separate CSS file

const ItemRecords = () => {
    const [items, setItems] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axiosInstance.get('/admin/items');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    const handleEditClick = (item) => {
        setEditingId(item._id);
        setEditFormData({
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price,
            description: item.description,
            category: item.category,
            totalValue: item.quantity * item.price,
            name: item.inventory?.name || 'N/A',
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            if (name === 'quantity' || name === 'price') {
                updatedData.totalValue = updatedData.quantity * updatedData.price;
            }
            return updatedData;
        });
    };

    const handleSaveClick = async (itemId) => {
        try {
            const response = await axiosInstance.put(
                `/items/${itemId}`,
                {
                    name: editFormData.itemName,
                    price: parseInt(editFormData.price),
                    quantity: parseInt(editFormData.quantity),
                    category: editFormData.category,
                },
                { withCredentials: true }
            );
            setItems(items.map(item => item._id === itemId ? response.data.updatedItem : item));
            setEditingId(null);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await axiosInstance.delete(`/items/${itemId}`, { withCredentials: true });
            setItems(items.filter(item => item._id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="container">
            <h2 className="title">Item Records</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Inventory Name</th>
                        <th>Total Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td>
                                {editingId === item._id ? (
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={editFormData.itemName}
                                        onChange={handleEditFormChange}
                                        className="input-field"
                                    />
                                ) : (
                                    item.itemName
                                )}
                            </td>
                            <td>
                                {editingId === item._id ? (
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={editFormData.quantity}
                                        onChange={handleEditFormChange}
                                        className="input-field"
                                    />
                                ) : (
                                    item.quantity
                                )}
                            </td>
                            <td>
                                {editingId === item._id ? (
                                    <input
                                        type="number"
                                        name="price"
                                        value={editFormData.price}
                                        onChange={handleEditFormChange}
                                        className="input-field"
                                    />
                                ) : (
                                    `₹${item.price}`
                                )}
                            </td>
                            <td>{editingId === item._id ? (
                                <input
                                    type="text"
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditFormChange}
                                    className="input-field"
                                />
                            ) : (
                                item.description || 'N/A'
                            )}</td>
                            <td>
                                {editingId === item._id ? (
                                    <input
                                        type="text"
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditFormChange}
                                        className="input-field"
                                    />
                                ) : (
                                    item.category || 'N/A'
                                )}
                            </td>
                            <td>{item.inventory?.name || 'N/A'}</td>
                            <td>
                                {editingId === item._id ? (
                                    <input
                                        type="text"
                                        name="totalValue"
                                        value={`₹${editFormData.totalValue.toFixed(2)}`}
                                        readOnly
                                        className="input-field readonly-input"
                                    />
                                ) : (
                                    `₹${(item.quantity * item.price).toFixed(2)}`
                                )}
                            </td>
                            <td className="action-buttons">
                                {editingId === item._id ? (
                                    <>
                                        <button onClick={() => handleSaveClick(item._id)} className="button save">Save</button>
                                        <button onClick={() => setEditingId(null)} className="button cancel">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditClick(item)} className="button edit">Edit</button>
                                        <button onClick={() => deleteItem(item._id)} className="button delete">Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemRecords;
