import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { name, email, password });
      setSuccess('Registration successful! Please login.');
      setError('');
      setName(''); setEmail(''); setPassword('');
      onSignup && onSignup();
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-8">
      <h2 className="text-xl font-bold">Sign Up</h2>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="input input-bordered w-full" required />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input input-bordered w-full" required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input input-bordered w-full" required />
      <button type="submit" className="btn btn-primary w-full">Sign Up</button>
    </form>
  );
};

export default Signup;
