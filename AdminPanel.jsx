import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const AdminPanel = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalUploads: 0, topChartTypes: [] });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const [statsRes, usersRes] = await Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/admin/users')
    ]);
    setStats(statsRes.data);
    setUsers(usersRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleBlock = async (id) => {
    await axios.put(`/api/admin/users/${id}/block`);
    fetchAll();
  };
  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/users/${id}`);
    fetchAll();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow">
          <div className="text-3xl font-bold">{stats.totalUsers}</div>
          <div>Total Users</div>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <div className="text-3xl font-bold">{stats.totalUploads}</div>
          <div>Total Uploads</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <div className="text-lg font-bold mb-1">Top Chart Types</div>
          <ul>
            {stats.topChartTypes.map((c, i) => (
              <li key={i}>{c.type}: {c.count}</li>
            ))}
          </ul>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Users</h3>
      {loading ? <div>Loading...</div> : (
        <table className="table w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className={user.isBlocked ? 'bg-red-100' : ''}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                <td>
                  <button className="btn btn-xs btn-warning mr-2" onClick={() => handleBlock(user._id)}>
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
