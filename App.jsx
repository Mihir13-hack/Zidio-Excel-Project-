
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import axios from './utils/axiosInstance';

const Dashboard = () => <h2 className="text-2xl mt-8 text-center">User Dashboard</h2>;
const AdminPanel = () => <h2 className="text-2xl mt-8 text-center">Admin Panel</h2>;

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/me').then(res => setUser(res.data)).catch(() => setUser(false));
    } else {
      setUser(false);
    }
  }, []);
  if (user === null) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/me').then(res => setCurrentUser(res.data)).catch(() => setCurrentUser(null));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to={currentUser ? (currentUser.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
