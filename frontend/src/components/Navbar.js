import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './Button';
import './Navbar.css';

/**
 * Simple NavItem component
 */
const NavItem = ({ to, isActive, children }) => {
  return (
    <Link 
      to={to} 
      className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
    >
      {children}
    </Link>
  );
};

/**
 * Simple Navbar component with minimal styling
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  // Update active link based on current path
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/" aria-label="JobKhoj Home">
          <h1 className="navbar__logo-text">JobKhoj</h1>
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="navbar__mobile-menu-button"
        onClick={toggleMenu} 
        aria-expanded={isMenuOpen} 
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <span className="navbar__hamburger"></span>
      </button>
      
      {/* Desktop menu */}
      <div className="navbar__links navbar__links--desktop">
        <NavItem 
          to="/" 
          isActive={activeLink === '/'}
        >
          Home
        </NavItem>
        
        {user ? (
          // Authenticated user menu
          <>
            {user.role === 'jobseeker' && (
              <NavItem 
                to="/jobs" 
                isActive={activeLink === '/jobs'}
              >
                Browse Jobs
              </NavItem>
            )}
            
            {user.role === 'employer' && (
              <NavItem 
                to="/post-job" 
                isActive={activeLink === '/post-job'}
              >
                Post a Job
              </NavItem>
            )}
            
            <NavItem 
              to="/profile" 
              isActive={activeLink === '/profile'}
            >
              Profile
            </NavItem>
            
            {user.role === 'jobseeker' && (
              <NavItem 
                to="/applications" 
                isActive={activeLink === '/applications'}
              >
                Applications
              </NavItem>
            )}
            
            {user.role === 'employer' && (
              <NavItem 
                to="/my-jobs" 
                isActive={activeLink === '/my-jobs'}
              >
                My Jobs
              </NavItem>
            )}
            
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="navbar__logout-button"
            >
              Logout
            </Button>
          </>
        ) : (
          // Guest user menu
          <>
            <NavItem 
              to="/login" 
              isActive={activeLink === '/login'}
            >
              Login
            </NavItem>
            <NavItem 
              to="/register" 
              isActive={activeLink === '/register'}
            >
              Register
            </NavItem>
          </>
        )}
      </div>
      
      {/* Mobile menu */}
      <div className={`navbar__links navbar__links--mobile ${isMenuOpen ? 'navbar__links--open' : ''}`}>
        <NavItem 
          to="/" 
          isActive={activeLink === '/'} 
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </NavItem>
        
        {user ? (
          // Authenticated user menu
          <>
            {user.role === 'jobseeker' && (
              <NavItem 
                to="/jobs" 
                isActive={activeLink === '/jobs'}
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Jobs
              </NavItem>
            )}
            
            {user.role === 'employer' && (
              <NavItem 
                to="/post-job" 
                isActive={activeLink === '/post-job'}
                onClick={() => setIsMenuOpen(false)}
              >
                Post a Job
              </NavItem>
            )}
            
            <NavItem 
              to="/profile" 
              isActive={activeLink === '/profile'}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </NavItem>
            
            {user.role === 'jobseeker' && (
              <NavItem 
                to="/applications" 
                isActive={activeLink === '/applications'}
                onClick={() => setIsMenuOpen(false)}
              >
                Applications
              </NavItem>
            )}
            
            {user.role === 'employer' && (
              <NavItem 
                to="/my-jobs" 
                isActive={activeLink === '/my-jobs'}
                onClick={() => setIsMenuOpen(false)}
              >
                My Jobs
              </NavItem>
            )}
            
            <Button 
              variant="ghost"
              onClick={handleLogout}
              className="navbar__logout-button"
            >
              Logout
            </Button>
          </>
        ) : (
          // Guest user menu
          <>
            <NavItem 
              to="/login" 
              isActive={activeLink === '/login'}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </NavItem>
            <NavItem 
              to="/register" 
              isActive={activeLink === '/register'}
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </NavItem>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;