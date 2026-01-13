import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Intro.css';

const Intro = () => {
  const { user, logout } = useAuth();
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowTitle(true), 100);
    setTimeout(() => setShowSubtitle(true), 600);
    setTimeout(() => setShowButtons(true), 1000);
  }, []);

  const handleStartGame = () => {
    navigate('/main', { state: { difficulty: selectedDifficulty } });
  };

  return (
    <div className="intro-container" style={{backgroundImage: `url(${import.meta.env.BASE_URL}images/wallpaper.png)`}}>
      <div className="intro-content" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
        {/* Top Navigation Buttons */}
        <div style={{position: 'fixed', top: '20px', right: '30px', display: 'flex', gap: '15px', zIndex: 1000}}>
          {user && (
            <button 
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'rgba(59, 130, 246, 0.95)',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fff';
                e.target.style.color = '#3b82f6';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(59, 130, 246, 0.95)';
                e.target.style.color = '#fff';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
              }}
            >
              📊 Dashboard
            </button>
          )}
          <button 
            onClick={() => navigate('/leaderboard')}
            style={{
              background: 'rgba(251, 191, 36, 0.95)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#fff';
              e.target.style.color = '#fbbf24';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(251, 191, 36, 0.95)';
              e.target.style.color = '#fff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.3)';
            }}
          >
            🏆 Leaderboard
          </button>
        </div>

        <div className="brand-badge" style={{color: '#FFFFFF !important', filter: 'brightness(1)', marginBottom: '40px', fontSize: '24px', padding: '15px 30px'}}>FAMOUSGUESSR</div>
        
        <h1 className={`intro-title ${showTitle ? 'fade-in' : ''}`} style={{color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', textAlign: 'center', marginBottom: '20px'}}>
          FIND THE HOMETOWNS OF CELEBRITIES 
        </h1>
        
        <p className={`intro-description ${showSubtitle ? 'fade-in' : ''}`} style={{color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', textAlign: 'center', marginBottom: '60px', fontSize: '18px'}}>
          Find Turkish celebrities' hometowns on Turkey map.
        </p>

        {!user ? (
          // Login/Register Buttons - for non-logged users
          <div className={`auth-buttons ${showButtons ? 'fade-in' : ''}`} style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: '#ff4757',
                border: '3px solid #ff4757',
                color: '#fff',
                padding: '15px 50px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '700',
                transition: 'all 0.3s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff3838';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ff4757';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              style={{
                background: '#ff4757',
                border: '3px solid #ff4757',
                color: '#fff',
                padding: '15px 50px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '700',
                transition: 'all 0.3s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff3838';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ff4757';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Register
            </button>
          </div>
        ) : (
          // Difficulty Selection + Start Game - for logged users
          <>
            <div style={{color: '#fff', fontSize: '18px', marginBottom: '10px', textAlign: 'center'}}>
              Welcome, <strong>{user.username}</strong>! 
              <button 
                onClick={logout} 
                style={{marginLeft: '15px', background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '5px 15px', borderRadius: '15px', cursor: 'pointer', fontSize: '14px'}}
              >
                Logout
              </button>
            </div>
            
            <div className={`difficulty-selection ${showButtons ? 'fade-in' : ''}`} style={{marginTop: '30px'}}>
              <h3 style={{color: '#FFFFFF', marginBottom: '15px', fontSize: '18px', textAlign: 'center'}}>SELECT MODE</h3>
              <div className="difficulty-buttons" style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
                <button 
                  className={`difficulty-btn ${selectedDifficulty === 'normal' ? 'selected' : ''}`}
                  onClick={() => setSelectedDifficulty('normal')}
                  style={{
                    background: selectedDifficulty === 'normal' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    border: '2px solid #fff',
                    color: '#fff',
                    padding: '15px 25px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    minWidth: '150px',
                    transition: 'all 0.3s'
                  }}
                >
                  <span style={{fontSize: '24px'}}>⏱️</span>
                  <span style={{fontWeight: 'bold', fontSize: '16px'}}>NORMAL</span>
                  <span style={{fontSize: '12px'}}>90 seconds</span>
                </button>
                <button 
                  className={`difficulty-btn ${selectedDifficulty === 'hard' ? 'selected' : ''}`}
                  onClick={() => setSelectedDifficulty('hard')}
                  style={{
                    background: selectedDifficulty === 'hard' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    border: '2px solid #fff',
                    color: '#fff',
                    padding: '15px 25px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    minWidth: '150px',
                    transition: 'all 0.3s'
                  }}
                >
                  <span style={{fontSize: '24px'}}>🔥</span>
                  <span style={{fontWeight: 'bold', fontSize: '16px'}}>HARD</span>
                  <span style={{fontSize: '12px'}}>60s | -3s wrong | +1s correct</span>
                </button>
                <button 
                  className={`difficulty-btn ${selectedDifficulty === 'duo' ? 'selected' : ''}`}
                  onClick={() => setSelectedDifficulty('duo')}
                  style={{
                    background: selectedDifficulty === 'duo' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    border: '2px solid #fff',
                    color: '#fff',
                    padding: '15px 25px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    minWidth: '150px',
                    transition: 'all 0.3s'
                  }}
                >
                  <span style={{fontSize: '24px'}}>👥</span>
                  <span style={{fontWeight: 'bold', fontSize: '16px'}}>DUO</span>
                  <span style={{fontSize: '12px'}}>90s | 2 Players | Highest score wins</span>
                </button>
              </div>
            </div>

            <button 
              className={`start-button geoguessr-style ${showButtons ? 'fade-in' : ''}`}
              onClick={handleStartGame}
              style={{
                background: '#fff',
                color: '#1a1a2e',
                border: 'none',
                padding: '15px 60px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '700',
                marginTop: '30px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s'
              }}
            >
              START GAME
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Intro;

