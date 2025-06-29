import React, { useState } from 'react';
import { signupUser } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    roll_no: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signupUser(formData);
      setMessage(res.data.msg);
      setFormData({
        name: '',
        roll_no: '',
        email: '',
        password: '',
        role: 'student',
      });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || 'Signup failed. Try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Signup</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <input
          type="text"
          name="roll_no"
          placeholder="Roll Number"
          value={formData.roll_no}
          onChange={handleChange}
          required
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
