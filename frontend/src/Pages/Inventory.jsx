import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import InventoryNav from '../Components/InventoryNav';
import Display from '../Components/Display';
import CreateInventoryForm from '../Components/CreateInventory';
import CreateItems from '../Components/CreateItems';
import UpdateInventory from '../Components/UpdateInventory';
import EditInventory from '../Components/EditInventory';
import Categories from '../Components/Categories';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import '../CSS/inv.css'; 

const Inventory = () => {
    const { companyName } = useParams(); 
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isItemsOpen, setIsItemsOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('display');

    return (
        <div className="inventory-container">
            <InventoryNav />
            <div className="inventory-layout">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-links">
                        <Link 
                            to={`/profile/${companyName}/dashboard`}
                            className={`sidebar-link ${activeComponent === 'display' ? 'active' : ''}`}
                            onClick={() => setActiveComponent('display')} 
                        >
                            Dashboard
                        </Link>

                        {/* Create Inventory */}
                        <div>
                            <button
                                className={`dropdown-button ${isInventoryOpen ? 'active' : ''}`}
                                onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                            >
                                Create Inventory
                                {isInventoryOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </button>

                            {isInventoryOpen && (
                                <div className="dropdown-menu">
                                    <Link 
                                        to={`/profile/${companyName}/create-inventory`} 
                                        className={`dropdown-item ${activeComponent === 'createInventory' ? 'active' : ''}`}
                                        onClick={() => setActiveComponent('createInventory')}
                                    >
                                        Create Inventory
                                    </Link>
                                    <Link 
                                        to={`/profile/${companyName}/edit-inventory`} 
                                        className={`dropdown-item ${activeComponent === 'editInventory' ? 'active' : ''}`}
                                        onClick={() => setActiveComponent('editInventory')}
                                    >
                                        Edit Inventory
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Create Items */}
                        <div>
                            <button
                                className={`dropdown-button ${isItemsOpen ? 'active' : ''}`}
                                onClick={() => setIsItemsOpen(!isItemsOpen)}
                            >
                                Create Items
                                {isItemsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </button>

                            {isItemsOpen && (
                                <div className="dropdown-menu">
                                    <Link 
                                        to={`/profile/${companyName}/create-item`} 
                                        className={`dropdown-item ${activeComponent === 'createItems' ? 'active' : ''}`}
                                        onClick={() => setActiveComponent('createItems')}
                                    >
                                        Create Item
                                    </Link>
                                    <Link 
                                        to={`/profile/${companyName}/update-item`} 
                                        className={`dropdown-item ${activeComponent === 'updateItems' ? 'active' : ''}`}
                                        onClick={() => setActiveComponent('updateItems')}
                                    >
                                        Update Item
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Categories */}
                        <div>
                            <button
                                className={`dropdown-button ${isCategoriesOpen ? 'active' : ''}`}
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            >
                                Categories
                                {isCategoriesOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </button>

                            {isCategoriesOpen && (
                                <div className="dropdown-menu">
                                    <Link 
                                        to={`/profile/${companyName}/categories`} 
                                        className={`dropdown-item ${activeComponent === 'categories' ? 'active' : ''}`}
                                        onClick={() => setActiveComponent('categories')}
                                    >
                                        Manage Categories
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="content-area">
                    {activeComponent === 'display' && <Display />}
                    {activeComponent === 'createInventory' && <CreateInventoryForm />}
                    {activeComponent === 'updateItems' && <UpdateInventory />}
                    {activeComponent === 'createItems' && <CreateItems />}
                    {activeComponent === 'editInventory' && <EditInventory />}
                    {activeComponent === 'categories' && <Categories />}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
