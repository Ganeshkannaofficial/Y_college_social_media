import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { loginUser } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      alert('Login successful');
      sessionStorage.setItem('token', res.data.token); // Save JWT
      navigate('/Homepage');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Student/Faculty Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
