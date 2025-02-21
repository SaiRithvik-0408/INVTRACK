import React, { useEffect, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { axiosInstance } from '../axios';
import './css/createitems.css'; // Import the CSS file

const CreateItems = ({ inventoryId }) => {
    const categories = [
        'Electronics', 'Furniture', 'Clothing', 'Food & Beverage','Office Supplies', 'Tools','medical', 'Household Goods', 'Sporting Goods', 'Toys', 'Books','Cosmetics', 'Medical Supplies', 'Accessories', 'Others'
    ];

    const [inventories, setInventories] = useState([]);
    const [itemData, setItemData] = useState({
        itemName: '',
        quantity: '',
        price: '',
        description: '',
        category: '',
        inventory: inventoryId || '',
    });
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const response = await axiosInstance.get('/inventories', { withCredentials: true });
                setInventories(response.data);
            } catch (error) {
                console.error("Error fetching inventories:", error);
            }
        };
        fetchInventories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItemData({ ...itemData, [name]: value });

        if (name === 'category') {
            setShowCategoryDropdown(true);
            setFilteredCategories(
                categories.filter(category =>
                    category.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    const handleCategorySelect = (category) => {
        setItemData({ ...itemData, category });
        setShowCategoryDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/inventory/${itemData.inventory}/items/create`, {
                items: [itemData]
            }, { withCredentials: true });
            setAlertMessage("Item added successfully!");
            setItemData({
                itemName: '',
                quantity: '',
                price: '',
                description: '',
                category: '',
                inventory: inventoryId || ''
            });
            setTimeout(() => setAlertMessage(''), 3000);
        } catch (error) {
            console.error("Error creating item:", error);
        }
    };

    return (
        <div className="create-items-container">
            <h2 className="create-items-title">Add New Item</h2>

            {alertMessage && (
                <div className="success-message">
                    <BadgeCheck size={28} color="#46d876" className="success-icon" />
                    {alertMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="create-items-form">
                <div>
                    <label className="input-label">Item Name</label>
                    <input
                        type="text"
                        name="itemName"
                        value={itemData.itemName}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="input-label">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={itemData.quantity}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="input-label">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={itemData.price}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="input-label">Description</label>
                    <textarea
                        name="description"
                        value={itemData.description}
                        onChange={handleChange}
                        className="input-field"
                        rows="3"
                    />
                </div>

                <div className="relative">
                    <label className="input-label">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={itemData.category}
                        onChange={handleChange}
                        required
                        placeholder="Type to search or select category"
                        className="input-field"
                        onFocus={() => setShowCategoryDropdown(true)}
                    />
                    {showCategoryDropdown && filteredCategories.length > 0 && (
                        <div className="dropdown">
                            {filteredCategories.map((category, index) => (
                                <div key={index} onClick={() => handleCategorySelect(category)} className="dropdown-item">
                                    {category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="input-label">Select Inventory</label>
                    <select
                        name="inventory"
                        value={itemData.inventory}
                        onChange={handleChange}
                        required
                        className="input-field"
                    >
                        <option value="">Select Inventory</option>
                        {inventories.map((inventory) => (
                            <option key={inventory._id} value={inventory._id}>
                                {inventory.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="submit-button">Add Item</button>
            </form>
        </div>
    );
};

export default CreateItems;
