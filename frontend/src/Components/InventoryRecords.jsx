import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../axios';
import './admincss/inventoryrecords.css'; 

const InventoryRecords = () => {
    const [inventories, setInventories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await axiosInstance.get('/admin/inventories', { withCredentials: true });
                setInventories(response.data);
            } catch (error) {
                console.error('Error fetching inventories:', error);
            }
        };
        fetchInventories();
    }, []);

    const handleEditClick = (inventory) => {
        setEditingId(inventory._id);
        setEditFormData({
            name: inventory.name || '',
            description: inventory.description || '',
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveClick = async (inventoryId) => {
        try {
            const response = await axiosInstance.put(`/admin/inventories/${inventoryId}`, editFormData, { withCredentials: true });
            setInventories((prevInventories) =>
                prevInventories.map((inv) => (inv._id === inventoryId ? response.data : inv))
            );
            setEditingId(null);
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    };

    const deleteInventory = async (inventoryId) => {
        try {
            await axiosInstance.delete(`/admin/inventories/${inventoryId}`, { withCredentials: true });
            setInventories(inventories.filter(inv => inv._id !== inventoryId));
        } catch (error) {
            console.error('Error deleting inventory:', error);
        }
    };

    return (
        <div className="inventory-admin-container">
            <h2 className="inventory-title">Inventory Records</h2>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Total Value</th>
                        <th>Total Quantity</th>
                        <th>Total Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventories.map(inv => (
                        <tr key={inv._id} className="inventory-row">
                            <td>
                                {editingId === inv._id ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditFormChange}
                                        className="input-field"
                                    />
                                ) : (
                                    inv.name
                                )}
                            </td>
                            <td>
                                {editingId === inv._id ? (
                                    <input
                                        type="text"
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditFormChange}
                                        className="input-field"
                                    />
                                ) : (
                                    inv.description || 'N/A'
                                )}
                            </td>
                            <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td>₹{inv.totalInventoryValue.toFixed(2)}</td>
                            <td>{inv.totalInventoryQuantity}</td>
                            <td>{inv.totalInventoryItems}</td>
                            <td className="action-buttons">
                                {editingId === inv._id ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveClick(inv._id)}
                                            className="button save"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="button cancel"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(inv)}
                                            className="button edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteInventory(inv._id)}
                                            className="button delete"
                                        >
                                            Delete
                                        </button>
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

export default InventoryRecords;
