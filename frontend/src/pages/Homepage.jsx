import React, { useState } from 'react';
import Feed from './feed';
import OfficialFeed from './OfficialFeed';
import Profile from './Profile';
import './Homepage.css';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('normal');

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="homepage-container">
      {/* Top Row with Title and Logout */}
      <div className="homepage-header">
        <h1 className="homepage-title">Y-INTRA COLLEGE SOCIAL MEDIA</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'normal' && <Feed />}
        {activeTab === 'official' && <OfficialFeed />}
        {activeTab === 'profile' && <Profile />}
      </div>

      {/* Fixed Footer Navigation */}
      <div className="footer-nav">
        <button
          className={activeTab === 'normal' ? 'active' : ''}
          onClick={() => setActiveTab('normal')}
        >
          Home
        </button>
        <button
          className={activeTab === 'official' ? 'active' : ''}
          onClick={() => setActiveTab('official')}
        >
          Official
        </button>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default HomePage;
