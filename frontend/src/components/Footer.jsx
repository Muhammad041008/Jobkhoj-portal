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
            <a href="https://www.facebook.com/JobKhoj" className="footer__social-link" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com/JobKhoj" className="footer__social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/company/jobkhoj" className="footer__social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com/jobkhoj" className="footer__social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <div className="footer__section">
          <h3 className="footer__title">Quick Links</h3>
          <ul className="footer__links-list">
            <li><FooterLink to="/">Home</FooterLink></li>
            <li><FooterLink to="/jobs">Find Jobs</FooterLink></li>
            <li><FooterLink to="/post-job">Post Job</FooterLink></li>
            <li><FooterLink to="/about">About Us</FooterLink></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3 className="footer__title">For Job Seekers</h3>
          <ul className="footer__links-list">
            <li><FooterLink to="/profile">Create Profile</FooterLink></li>
            <li><FooterLink to="/applications">My Applications</FooterLink></li>
            <li><FooterLink to="/jobs">Browse Jobs</FooterLink></li>
            <li><FooterLink to="/career-advice">Career Advice</FooterLink></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3 className="footer__title">For Employers</h3>
          <ul className="footer__links-list">
            <li><FooterLink to="/post-job">Post a Job</FooterLink></li>
            <li><FooterLink to="/my-jobs">My Jobs</FooterLink></li>
            <li><FooterLink to="/candidates">Browse Candidates</FooterLink></li>
            <li><FooterLink to="/pricing">Pricing Plans</FooterLink></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h3 className="footer__title">Legal</h3>
          <ul className="footer__links-list">
            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
            <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
            <li><FooterLink to="/cookie-policy">Cookie Policy</FooterLink></li>
            <li><FooterLink to="/gdpr">GDPR Compliance</FooterLink></li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <div className="footer__bottom-content">
          <p className="footer__copyright">
            © {new Date().getFullYear()} JobKhoj. All rights reserved.
          </p>
          <div className="footer__additional-links">
            <FooterLink to="/sitemap" variant="small">Sitemap</FooterLink>
            <FooterLink to="/contact" variant="small">Contact Us</FooterLink>
            <FooterLink to="/faq" variant="small">FAQ</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;