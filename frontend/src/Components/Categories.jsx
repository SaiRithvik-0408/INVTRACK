import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../axios';
import './css/categories.css'; 

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const currencySymbol = '₹'; 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories', { withCredentials: true });
                console.log(response.data.categories); // Log the categories
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('An error occurred while fetching categories.');
            }
        };
        fetchCategories();
    }, []);

    // Fetch items when a category is selected
    const handleCategorySelect = async (categoryId) => {
        setSelectedCategory(categoryId);
        try {
            const response = await axiosInstance.get(`/categories/${categoryId}/items`, { withCredentials: true });
            console.log(response.data);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items for the selected category:', error);
            setError('An error occurred while fetching items.');
        }
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="categories-container">
            <h2 className="categories-heading">Select Category to View Items</h2>

            <div>
                <select
                    value={selectedCategory || ''}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="categories-select"
                >
                    <option value="" disabled>Select a Category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total Cost</th>
                            <th>Inventory Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item._id}>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>{currencySymbol}{item.price.toFixed(2)}</td>
                                <td>{currencySymbol}{(item.price * item.quantity).toFixed(2)}</td>
                                <td>{item.inventoryName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* No items message */}
            {selectedCategory && items.length === 0 && (
                <p className="no-items-message">No items found in this category.</p>
            )}
        </div>
    );
};

export default Categories;
