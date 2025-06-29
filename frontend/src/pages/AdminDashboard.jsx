import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/pending-users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setPendingUsers(res.data);
    } catch (err) {
      alert('Failed to fetch pending users');
    }
  };

  const approveUser = async (id) => {
    try {
      await axios.post(`http://localhost:5000/admin/approve-user/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      alert('User approved');
      setPendingUsers(pendingUsers.filter(user => user.id !== id));
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pending User Approvals</h2>
      {pendingUsers.length === 0 ? (
        <p>No pending users</p>
      ) : (
        <ul>
          {pendingUsers.map((user) => (
            <li key={user.id} style={{ marginBottom: '10px' }}>
              <strong>{user.name}</strong> - {user.email} ({user.role})<br />
              Roll No: {user.roll_no}
              <button onClick={() => approveUser(user.id)} style={{ marginLeft: '10px' }}>
                Approve ✅
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
