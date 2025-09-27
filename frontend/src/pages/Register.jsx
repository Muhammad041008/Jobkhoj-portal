import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled from 'styled-components';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';

const Register = () => {
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic form validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      addNotification({
        message: 'Please fill in all fields',
        type: 'error',
      });
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addNotification({
        message: 'Please enter a valid email address',
        type: 'error',
      });
      setIsLoading(false);
      return;
    }

    // Password length validation
    if (formData.password.length < 8) {
      addNotification({
        message: 'Password must be at least 8 characters long',
        type: 'error',
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      addNotification({
        message: 'Registration successful! Please login.',
        type: 'success',
      });
      navigate('/login');
    } catch (err) {
      addNotification({
        message: err.message || 'Registration failed. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <RegisterContainer>
        <RegisterFormContainer>
          <Loader size="medium" label="Creating account..." />
        </RegisterFormContainer>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterFormContainer>
        <FormTitle>Create Your Account</FormTitle>
        <FormSubtitle>Join JobKhoj as a job seeker, employer, or admin</FormSubtitle>
        
        <RegisterForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <FormInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
            <PasswordHint>
              Password must be at least 8 characters long
            </PasswordHint>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="role">I am a:</FormLabel>
            <RoleSelect
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </RoleSelect>
          </FormGroup>

          <Button type="submit" fullWidth size="large" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </RegisterForm>

        <LoginLinkContainer>
          <span>Already have an account? </span>
          <LoginLink to="/login">Login here</LoginLink>
        </LoginLinkContainer>
      </RegisterFormContainer>
    </RegisterContainer>
  );
};

// Styled components
const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  padding: 2rem;
`;

const RegisterFormContainer = styled.div`
  background-color: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const PasswordHint = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const RoleSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;



const LoginLinkContainer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const LoginLink = styled(Link)`
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

export default Register;