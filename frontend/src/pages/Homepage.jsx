import React, { useState } from 'react';
import Feed from './feed';
import OfficialFeed from './OfficialFeed';
import Profile from './Profile';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('normal');

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 20px' }}>
      <h1>Welcome to College Social Media</h1>

      {/* Add marginTop here to push buttons down */}
      <div style={{ display: 'flex', marginTop: '20px', marginBottom: '20px', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('normal')}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: activeTab === 'normal' ? '#007bff' : '#ddd',
            color: activeTab === 'normal' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('official')}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: activeTab === 'official' ? '#007bff' : '#ddd',
            color: activeTab === 'official' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Official
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: activeTab === 'profile' ? '#007bff' : '#ddd',
            color: activeTab === 'profile' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Profile
        </button>
      </div>

      <div>
        {activeTab === 'normal' && <Feed />}
        {activeTab === 'official' && <OfficialFeed />}
        {activeTab === 'profile' && <Profile />}
      </div>
    </div>
  );
};

export default HomePage;
