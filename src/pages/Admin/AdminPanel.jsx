import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { celebrityAPI, userAPI, premiumAPI } from '../../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [celebrities, setCelebrities] = useState([]);
  const [users, setUsers] = useState([]);
  const [premiumRequests, setPremiumRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('celebrities');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthProvince: '',
    category: 'Actor',
    photo: '',
    coordinates: ['', ''],
    birthYear: '',
    bio: '',
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'celebrities') {
        const res = await celebrityAPI.getAll({ limit: 100 });
        setCelebrities(res.data.data);
      } else if (activeTab === 'users') {
        const res = await userAPI.getAll();
        setUsers(res.data.data);
      } else if (activeTab === 'premium') {
        const res = await premiumAPI.getAllRequests();
        setPremiumRequests(res.data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCelebrity = async (e) => {
    e.preventDefault();
    try {
      await celebrityAPI.create({
        ...formData,
        coordinates: [parseFloat(formData.coordinates[0]), parseFloat(formData.coordinates[1])],
        birthYear: parseInt(formData.birthYear),
      });
      setShowAddModal(false);
      loadData();
      // Reset form
      setFormData({
        name: '',
        birthProvince: '',
        category: 'Actor',
        photo: '',
        coordinates: ['', ''],
        birthYear: '',
        bio: '',
      });
    } catch (error) {
      console.error('Error adding celebrity:', error);
      alert(error.response?.data?.message || 'Error adding celebrity');
    }
  };

  const handleDeleteCelebrity = async (id) => {
    if (window.confirm('Are you sure you want to delete this celebrity?')) {
      try {
        await celebrityAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting celebrity:', error);
      }
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await userAPI.update(userId, { role: newRole });
      loadData();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handlePremiumRequest = async (requestId, status, response = '') => {
    try {
      await premiumAPI.processRequest(requestId, { 
        status, 
        adminResponse: response 
      });
      alert(`Premium request ${status === 'approved' ? 'approved' : 'rejected'}!`);
      loadData();
    } catch (error) {
      console.error('Error processing premium request:', error);
      alert('Could not process premium request');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <div className="admin-nav">
          <Link to="/dashboard" className="back-link">
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'celebrities' ? 'active' : ''}`}
            onClick={() => setActiveTab('celebrities')}
          >
            🌟 Celebrities ({celebrities.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users ({users.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'premium' ? 'active' : ''}`}
            onClick={() => setActiveTab('premium')}
          >
            ⭐ Premium Requests ({premiumRequests.filter(r => r.status === 'pending').length})
          </button>
        </div>

        {activeTab === 'celebrities' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Celebrity Management (CRUD Operations)</h2>
              <button className="add-btn" onClick={() => setShowAddModal(true)}>
                + Add Celebrity
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Province</th>
                      <th>Category</th>
                      <th>Coordinates</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {celebrities.map((celeb) => (
                      <tr key={celeb._id}>
                        <td>{celeb.name}</td>
                        <td>{celeb.birthProvince}</td>
                        <td>{celeb.category}</td>
                        <td>
                          {celeb.location.coordinates[0].toFixed(2)}, {celeb.location.coordinates[1].toFixed(2)}
                        </td>
                        <td>
                          <span className={`status ${celeb.isActive ? 'active' : 'inactive'}`}>
                            {celeb.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteCelebrity(celeb._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>User Management</h2>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Total Games</th>
                      <th>High Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                            className="role-select"
                          >
                            <option value="player">Player</option>
                            <option value="premium-player">Premium Player</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>{u.stats?.totalGames || 0}</td>
                        <td>{u.stats?.highScore || 0}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>{u.role}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'premium' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Premium Membership Requests</h2>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : premiumRequests.length === 0 ? (
              <p className="empty-message">No premium requests yet</p>
            ) : (
              <div className="premium-requests-list">
                {premiumRequests.map((request) => (
                  <div key={request._id} className={`premium-request-card ${request.status}`}>
                    <div className="request-header">
                      <div>
                        <h3>{request.user?.username}</h3>
                        <p className="user-email">{request.user?.email}</p>
                      </div>
                      <span className={`status-badge ${request.status}`}>
                        {request.status === 'pending' && '⏳ Pending'}
                        {request.status === 'approved' && '✅ Approved'}
                        {request.status === 'rejected' && '❌ Rejected'}
                      </span>
                    </div>
                    
                    {request.message && (
                      <div className="request-message">
                        <strong>Message:</strong> {request.message}
                      </div>
                    )}
                    
                    <div className="request-date">
                      Request Date: {new Date(request.createdAt).toLocaleDateString('en-US')}
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="request-actions">
                        <button 
                          className="approve-btn"
                          onClick={() => handlePremiumRequest(request._id, 'approved')}
                        >
                          ✅ Approve
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handlePremiumRequest(request._id, 'rejected')}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                    
                    {request.status !== 'pending' && (
                      <div className="request-processed">
                        <p>İşleyen: {request.processedBy?.username}</p>
                        <p>Tarih: {new Date(request.processedAt).toLocaleDateString('tr-TR')}</p>
                        {request.adminResponse && (
                          <p><strong>Yanıt:</strong> {request.adminResponse}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Celebrity Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Celebrity</h2>
            <form onSubmit={handleAddCelebrity} className="celebrity-form">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Birth Province"
                value={formData.birthProvince}
                onChange={(e) => setFormData({ ...formData, birthProvince: e.target.value })}
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Actor">Actor</option>
                <option value="Athlete">Athlete</option>
                <option value="Musician">Musician</option>
                <option value="Politician">Politician</option>
                <option value="Other">Other</option>
              </select>
              <div className="coordinates-input">
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData.coordinates[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, coordinates: [e.target.value, formData.coordinates[1]] })
                  }
                  required
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData.coordinates[1]}
                  onChange={(e) =>
                    setFormData({ ...formData, coordinates: [formData.coordinates[0], e.target.value] })
                  }
                  required
                />
              </div>
              <input
                type="number"
                placeholder="Birth Year"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
              />
              <input
                type="text"
                placeholder="Photo URL"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              />
              <textarea
                placeholder="Biography"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="3"
              />
              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  Add Celebrity
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
