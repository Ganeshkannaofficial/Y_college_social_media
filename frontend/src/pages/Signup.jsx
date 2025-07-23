import React, { useState } from 'react';
import { signupUser } from '../services/api';
import './Signup.css';

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
    <div className="signup-container">
      <h2>Signup</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name / Club Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* ID Field changes based on role */}
        {formData.role === 'student' && (
          <input
            type="text"
            name="roll_no"
            placeholder="Roll Number"
            value={formData.roll_no}
            onChange={handleChange}
            required
          />
        )}
        {formData.role === 'faculty' && (
          <input
            type="text"
            name="roll_no"
            placeholder="Staff ID"
            value={formData.roll_no}
            onChange={handleChange}
            required
          />
        )}
        {formData.role === 'club' && (
          <input
            type="text"
            name="roll_no"
            placeholder="Club Short Code (e.g., NSS001)"
            value={formData.roll_no}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="club">Club</option>
        </select>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
