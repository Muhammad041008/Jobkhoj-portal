import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Simple FooterLink component
 */
const FooterLink = ({ to, children, variant = '' }) => {
  const baseClass = 'footer__link';
  const variantClass = variant ? `footer__link--${variant}` : '';
  const classes = [baseClass, variantClass].filter(Boolean).join(' ');
  
  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
};

/**
 * Simple Footer component with minimal styling
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3 className="footer__title">JobKhoj</h3>
          <p className="footer__text">
            Connecting talented job seekers with their dream employers.
            Your one-stop platform for career opportunities and talent acquisition.
          </p>
          <div className="footer__social-links">
            <a href="#" className="footer__social-link" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <div className="footer__section">
          <h3 className="footer__title">Quick Links</h3>
          <ul className="footer__links">
            <li><FooterLink to="/">Home</FooterLink></li>
            <li><FooterLink to="/jobs">Find Jobs</FooterLink></li>
            <li><FooterLink to="/post-job">Post Job</FooterLink></li>
            <li><FooterLink to="/about">About Us</FooterLink></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3 className="footer__title">For Job Seekers</h3>
          <ul className="footer__links">
            <li><FooterLink to="/profile">Create Profile</FooterLink></li>
            <li><FooterLink to="/applications">My Applications</FooterLink></li>
            <li><FooterLink to="/jobs">Browse Jobs</FooterLink></li>
            <li><FooterLink to="/career-advice">Career Advice</FooterLink></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3 className="footer__title">For Employers</h3>
          <ul className="footer__links">
            <li><FooterLink to="/post-job">Post a Job</FooterLink></li>
            <li><FooterLink to="/my-jobs">My Jobs</FooterLink></li>
            <li><FooterLink to="/applications">View Applications</FooterLink></li>
            <li><FooterLink to="/pricing">Pricing Plans</FooterLink></li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <div className="footer__bottom-content">
          <p className="footer__copyright">&copy; {new Date().getFullYear()} JobKhoj. All rights reserved.</p>
          <ul className="footer__legal-links">
            <li><FooterLink to="/terms" variant="legal">Terms of Service</FooterLink></li>
            <li><FooterLink to="/privacy" variant="legal">Privacy Policy</FooterLink></li>
            <li><FooterLink to="/cookies" variant="legal">Cookie Policy</FooterLink></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;