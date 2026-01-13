import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { gameAPI, premiumAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [myScores, setMyScores] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [premiumRequests, setPremiumRequests] = useState([]);
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadPremiumRequests();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [scoresRes, leaderboardRes, statsRes] = await Promise.all([
        gameAPI.getMyScores({ limit: 5 }),
        gameAPI.getLeaderboard({ limit: 10 }),
        gameAPI.getStats(),
      ]);

      setMyScores(scoresRes.data.data);
      setLeaderboard(leaderboardRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPremiumRequests = async () => {
    try {
      const response = await premiumAPI.getMyRequests();
      setPremiumRequests(response.data.data);
    } catch (error) {
      console.error('Error loading premium requests:', error);
    }
  };

  const handlePremiumRequest = async () => {
    try {
      await premiumAPI.createRequest({ message: requestMessage });
      alert('Premium talebi gönderildi! Admin onayını bekleyiniz.');
      setShowRequestModal(false);
      setRequestMessage('');
      loadPremiumRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Premium talep gönderilemedi');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">FAMOUSGUESSR Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          {user?.role === 'premium-player' && (
            <span className="premium-badge">⭐ Premium</span>
          )}
          <Link to="/leaderboard" className="leaderboard-link">
            🏆 Leaderboard
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="admin-link">
              Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions" style={{marginBottom: '30px'}}>
          {user?.role === 'player' && !premiumRequests.some(r => r.status === 'pending') && (
            <button onClick={() => setShowRequestModal(true)} className="premium-request-button">
              ⭐ Request Premium Membership
            </button>
          )}
          {premiumRequests.some(r => r.status === 'pending') && (
            <div className="pending-request-notice">
              ⏳ Premium talebiniz beklemede
            </div>
          )}
          <Link to="/" className="home-button">
            🏠 Home
          </Link>
        </div>

        <div className="dashboard-grid">
          {/* User Stats */}
          <div className="dashboard-card">
            <h2>📊 Your Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Games</span>
                <span className="stat-value">{user?.stats?.totalGames || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">High Score</span>
                <span className="stat-value">{user?.stats?.highScore || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average Score</span>
                <span className="stat-value">
                  {user?.stats?.averageScore?.toFixed(1) || 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Points</span>
                <span className="stat-value">{user?.stats?.totalScore || 0}</span>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <div className="dashboard-card">
            <h2>🎯 Recent Games</h2>
            {myScores.length === 0 ? (
              <p className="empty-message">No games played yet!</p>
            ) : (
              <div className="scores-list">
                {myScores.map((score, index) => (
                  <div key={score._id} className="score-item">
                    <div className="score-info">
                      <span className="score-difficulty">{score.difficulty}</span>
                      <span className="score-date">
                        {new Date(score.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="score-details">
                      <span className="score-points">{score.score} pts</span>
                      <span className="score-accuracy">
                        {score.accuracy?.toFixed(0)}% accuracy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showRequestModal && (
          <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Premium Membership Request</h2>
              <p>With Premium membership, you will get:</p>
              <ul style={{textAlign: 'left', marginBottom: '15px', lineHeight: '1.8'}}>
                <li>💡 <strong>8 hints</strong> per game (instead of 4)</li>
                <li>⭐ <strong>1.25x score multiplier</strong> (earn 25% more points)</li>
              </ul>
              <textarea
                placeholder="You can write a message about your request (optional)"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows="4"
              />
              <div className="modal-actions">
                <button onClick={handlePremiumRequest} className="confirm-btn">
                  Send
                </button>
                <button onClick={() => setShowRequestModal(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
