import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../axios';
import './admincss/userrecords.css'; 
const UserRecords = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/admin/users', { withCredentials: true });
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            await axiosInstance.delete(`/admin/users/${userId}`, { withCredentials: true });
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const editUser = (user) => {
        setEditingUserId(user._id);
        setFormData({
            companyName: user.companyName || '',
            email: user.email || '',
            phone: user.phone || ''
        });
    };

    const saveUser = async () => {
        try {
            const response = await axiosInstance.put(`/admin/users/${editingUserId}`, formData, { withCredentials: true });
            const updatedUser = response.data;
            setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
            setEditingUserId(null);
            setFormData({ companyName: '', email: '', phone: '' });
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    return (
        <div className="user-records-container"> {/* Use class name from CSS */}
            <h2 className="user-records-title">User Records</h2> {/* Use class name from CSS */}
            <table className="user-records-table"> {/* Use class name from CSS */}
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            {editingUserId === user._id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={saveUser}>Save</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.companyName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <button onClick={() => editUser(user)}>Edit</button>
                                        <button onClick={() => deleteUser(user._id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserRecords;