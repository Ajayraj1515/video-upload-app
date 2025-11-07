import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Video Upload App
        </Link>
        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            {(user?.role === 'editor' || user?.role === 'admin') && (
              <Link to="/upload" className="navbar-link">
                Upload
              </Link>
            )}
            <Link to="/library" className="navbar-link">
              Library
            </Link>
            <div className="navbar-user">
              <span className="navbar-username">{user?.username}</span>
              <span className="navbar-role">({user?.role})</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

