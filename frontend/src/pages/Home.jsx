import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎓 College Connect</h1>
      <p style={{ marginBottom: 30 }}>A platform for students, faculty, and admins</p>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => navigate('/login')}>Login</button>
        <button style={styles.button} onClick={() => navigate('/signup')}>Signup</button>
        <button style={{ ...styles.button, backgroundColor: '#d9534f' }} onClick={() => navigate('/admin-login')}>
          Admin Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '80px auto',
    textAlign: 'center',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default Home;
