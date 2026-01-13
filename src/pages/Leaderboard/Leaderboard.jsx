import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameAPI } from '../../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('allTime'); // allTime, thisWeek, thisMonth
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await gameAPI.getLeaderboard({ limit: 50 });
      
      console.log('Leaderboard API Response:', response.data);
      
      // Get unique users from game scores
      const scoresData = response.data.data || response.data;
      
      console.log('Scores Data:', scoresData);
      
      // Group by user and get their best scores
      const userScoresMap = new Map();
      
      scoresData.forEach(score => {
        console.log('Processing score:', score);
        if (score.user && score.user._id) {
          const userId = score.user._id;
          if (!userScoresMap.has(userId)) {
            userScoresMap.set(userId, {
              _id: userId,
              username: score.user.username,
              stats: score.user.stats || {
                gamesPlayed: 0,
                highScore: 0,
                totalScore: 0,
                correctAnswers: 0,
                wrongAnswers: 0
              }
            });
            console.log('Added user to map:', score.user.username, score.user.stats);
          }
        } else {
          console.log('Score missing user data:', score);
        }
      });
      
      // Convert to array and sort by high score
      let playersArray = Array.from(userScoresMap.values());
      console.log('Players Array:', playersArray);
      playersArray.sort((a, b) => (b.stats.highScore || 0) - (a.stats.highScore || 0));
      
      setPlayers(playersArray);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1 className="leaderboard-title">🏆 Leaderboard</h1>
          <p className="leaderboard-subtitle">Top Players Worldwide</p>
        </div>

        <div className="time-filters">
          <button 
            className={`filter-btn ${timeFilter === 'allTime' ? 'active' : ''}`}
            onClick={() => setTimeFilter('allTime')}
          >
            All Time
          </button>
          <button 
            className={`filter-btn ${timeFilter === 'thisWeek' ? 'active' : ''}`}
            onClick={() => setTimeFilter('thisWeek')}
          >
            This Week
          </button>
          <button 
            className={`filter-btn ${timeFilter === 'thisMonth' ? 'active' : ''}`}
            onClick={() => setTimeFilter('thisMonth')}
          >
            This Month
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="leaderboard-list">
            {players.length === 0 ? (
              <div className="no-players">
                <p>No players yet. Be the first to play!</p>
              </div>
            ) : (
              players.map((player, index) => (
                <div 
                  key={player._id} 
                  className={`player-card ${getRankClass(index + 1)}`}
                >
                  <div className="player-rank">
                    <span className="rank-badge">{getMedalEmoji(index + 1)}</span>
                  </div>
                  
                  <div className="player-info">
                    <h3 className="player-name">{player.username}</h3>
                    <div className="player-stats-row">
                      <span className="leaderboard-stat-item">
                        🎮 {player.stats.gamesPlayed} games
                      </span>
                      <span className="leaderboard-stat-item">
                        ✅ {player.stats.correctAnswers} correct
                      </span>
                      <span className="leaderboard-stat-item">
                        📊 {player.stats.gamesPlayed > 0 
                          ? Math.round((player.stats.correctAnswers / (player.stats.correctAnswers + player.stats.wrongAnswers)) * 100) 
                          : 0}% accuracy
                      </span>
                    </div>
                  </div>

                  <div className="player-score">
                    <div className="high-score">
                      <span className="score-label">High Score</span>
                      <span className="score-value">{player.stats.highScore}</span>
                    </div>
                    <div className="total-score">
                      <span className="score-label">Total Points</span>
                      <span className="score-value">{player.stats.totalScore}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="play-now-section">
          <button className="play-now-btn" onClick={() => navigate('/')}>
            🎮 Play Now & Join the Leaderboard!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
