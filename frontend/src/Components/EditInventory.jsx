import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { axiosInstance } from "../axios";
import "./css/editInventory.css"; // Import the CSS file

const EditInventory = () => {
  const [inventories, setInventories] = useState([]);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/inventories", { withCredentials: true })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setInventories(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Failed to load inventories.");
        }
      })
      .catch((error) => {
        console.error("Error fetching inventories:", error);
        setError("An error occurred while fetching inventories.");
      });
  }, []);

  const handleDelete = (inventoryId) => {
    axiosInstance
      .delete(`/inventories/${inventoryId}`)
      .then(() => {
        setInventories((prevInventories) =>
          prevInventories.filter((inventory) => inventory._id !== inventoryId)
        );
      })
      .catch((error) => {
        console.error("Error deleting inventory:", error);
        setError("An error occurred while deleting the inventory.");
      });
  };

  const handleRename = (inventoryId) => {
    axiosInstance
      .put(`/inventories/${inventoryId}`, { name: updatedName })
      .then(() => {
        setInventories((prevInventories) =>
          prevInventories.map((inventory) =>
            inventory._id === inventoryId
              ? { ...inventory, name: updatedName }
              : inventory
          )
        );
        setEditMode(null);
        setUpdatedName("");
      })
      .catch((error) => {
        console.error("Error renaming inventory:", error);
        setError("An error occurred while renaming the inventory.");
      });
  };

  return (
    <div className="edit-inventory-container">
      <h2 className="edit-inventory-title">Edit Inventory</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="inventory-list">
        {inventories.length > 0 ? (
          inventories.map((inventory) => (
            <div key={inventory._id} className="inventory-item">
              <div className="inventory-content">
                {editMode === inventory._id ? (
                  <>
                    <input
                      type="text"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      className="inventory-input"
                      placeholder="New Inventory Name"
                      required
                    />
                    <button
                      onClick={() => handleRename(inventory._id)}
                      className="inventory-btn save-btn"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="inventory-name">{inventory.name}</h3>
                    <p className="inventory-description">
                      {inventory.description}
                    </p>
                  </>
                )}
              </div>
              <div className="inventory-actions">
                {editMode === inventory._id ? null : (
                  <button
                    onClick={() => {
                      setEditMode(inventory._id);
                      setUpdatedName(inventory.name);
                    }}
                    className="inventory-btn edit-btn"
                  >
                    <FaEdit />
                    Rename
                  </button>
                )}
                <button
                  onClick={() => handleDelete(inventory._id)}
                  className="inventory-btn delete-btn"
                >
                  <MdDelete />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-inventory-message">No inventories available.</p>
        )}
      </div>
    </div>
  );
};

export default EditInventory;
