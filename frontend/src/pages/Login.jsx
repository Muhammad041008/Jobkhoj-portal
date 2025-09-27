import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled, { keyframes } from 'styled-components';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, TRANSITIONS, BORDER_RADIUS, Z_INDEX, BREAKPOINTS } from '../services/theme';

const Login = () => {
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFocus = (field) => {
    setFocusedInput(field);
  };

  const handleBlur = (field) => {
    setFocusedInput(null);
    // Validate individual field on blur
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }
    
    if (field === 'password') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
    return !newErrors[field];
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      await login(formData);
      addNotification({
        message: 'Login successful!',
        type: 'success',
      });
      navigate('/profile'); // Redirect to profile page after successful login
    } catch (err) {
      addNotification({
        message: err.message || 'Login failed. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setIsLoading(true);
      // Simulated social login - in a real app, this would integrate with OAuth providers
      await new Promise(resolve => setTimeout(resolve, 1500));
      addNotification({
        message: `${provider} login successful!`,
        type: 'success',
      });
      navigate('/profile');
    } catch (err) {
      addNotification({
        message: `${provider} login failed. Please try again.`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoginContainer>
        <LoginContentWrapper>
          <LoginFormContainer>
            <Loader size="medium" label="Signing in..." />
          </LoginFormContainer>
        </LoginContentWrapper>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <div className="decorative-element decorative-element-1" />
      <div className="decorative-element decorative-element-2" />
      <LoginContentWrapper>
        <LoginFormContainer>
          <FormTitle>Login to JobKhoj</FormTitle>
          <FormSubtitle>Connect with your account</FormSubtitle>
          
          <LoginForm onSubmit={handleSubmit}>
            <FormGroup hasError={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                error={errors.email}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && <FormError>⚠️ {errors.email}</FormError>}
            </FormGroup>

            <FormGroup hasError={!!errors.password}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <ForgotPasswordLink to="/forgot-password">Forgot password?</ForgotPasswordLink>
              </div>
              <div style={{ position: 'relative' }}>
                <FormInput
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your password"
                  error={errors.password}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <PasswordToggleButton 
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </PasswordToggleButton>
              </div>
              {errors.password && <FormError>⚠️ {errors.password}</FormError>}
            </FormGroup>

            <Button 
              type="submit" 
              fullWidth 
              size="large" 
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader size="small" color={COLORS.bgPrimary} />
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </LoginForm>

          <SocialLoginContainer>
            <SocialLoginDivider>
              <SocialLoginText>or continue with</SocialLoginText>
            </SocialLoginDivider>
            <SocialButtons>
              <SocialButton 
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
                aria-label="Sign in with Google"
              >
                🔍
              </SocialButton>
              <SocialButton 
                onClick={() => handleSocialLogin('LinkedIn')}
                disabled={isLoading}
                aria-label="Sign in with LinkedIn"
              >
                💼
              </SocialButton>
              <SocialButton 
                onClick={() => handleSocialLogin('GitHub')}
                disabled={isLoading}
                aria-label="Sign in with GitHub"
              >
                🐙
              </SocialButton>
            </SocialButtons>
          </SocialLoginContainer>

          <RegisterLinkContainer>
            <span>Don't have an account? </span>
            <RegisterLink to="/register">
              <span style={{ position: 'relative' }}>
                Register here
                <span className="underline-animation" />
              </span>
            </RegisterLink>
          </RegisterLinkContainer>
        </LoginFormContainer>
      </LoginContentWrapper>
    </LoginContainer>
  );
};

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${COLORS.bgSecondary} 0%, ${COLORS.bgTertiary} 100%);
  padding: ${SPACING.md};
  font-family: ${TYPOGRAPHY.fontFamily};
  position: relative;
  overflow: hidden;
  animation: ${gradientShift} 15s ease infinite;
  background-size: 400% 400%;
  
  /* Background decorative elements */
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, ${COLORS.primaryLight}30 0%, transparent 70%);
    filter: blur(70px);
    z-index: 0;
    animation: ${floatAnimation} 8s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, ${COLORS.secondaryLight}30 0%, transparent 70%);
    filter: blur(70px);
    z-index: 0;
    animation: ${floatAnimation} 10s ease-in-out infinite reverse;
  }
  
  /* Additional decorative elements */
  & .decorative-element {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    z-index: 0;
  }
  
  & .decorative-element-1 {
    top: 30%;
    left: 15%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, ${COLORS.successLight}20 0%, transparent 70%);
    animation: ${floatAnimation} 9s ease-in-out infinite;
  }
  
  & .decorative-element-2 {
    bottom: 20%;
    right: 10%;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, ${COLORS.warningLight}20 0%, transparent 70%);
    animation: ${floatAnimation} 7s ease-in-out infinite reverse;
  }
`;

const LoginContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginFormContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: ${SPACING['2xl']};
  border-radius: ${BORDER_RADIUS.xl};
  box-shadow: ${SHADOWS.xl};
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} ${TRANSITIONS.slow} ease-out;
  transition: all ${TRANSITIONS.normal} ease;
  position: relative;
  overflow: hidden;
  
  /* Glassmorphism enhancement */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${shimmerAnimation} 2s infinite;
    z-index: 1;
    pointer-events: none;
  }
  
  &:hover {
    box-shadow: ${SHADOWS['2xl']};
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: ${BREAKPOINTS.sm}) {
    padding: ${SPACING.xl};
    margin: ${SPACING.sm};
    background: rgba(255, 255, 255, 0.9);
  }
`;

const FormTitle = styled.h1`
  font-size: ${TYPOGRAPHY.headings.h1};
  font-weight: ${TYPOGRAPHY.fontWeights.bold};
  margin-bottom: ${SPACING.sm};
  text-align: center;
  background: linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormSubtitle = styled.p`
  color: ${COLORS.textSecondary};
  text-align: center;
  margin-bottom: ${SPACING.xl};
  font-size: ${TYPOGRAPHY.fontSizes.md};
  font-weight: ${TYPOGRAPHY.fontWeights.regular};
  @media (max-width: ${BREAKPOINTS.sm}) {
    color: ${COLORS.textPrimary};
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.xs};
  transition: all ${TRANSITIONS.normal} ease;
  ${({ hasError }) => hasError && `
    transform: translateX(2px);
  `}
`;

const FormLabel = styled.label`
  font-weight: ${TYPOGRAPHY.fontWeights.medium};
  color: ${COLORS.textPrimary};
  font-size: ${TYPOGRAPHY.fontSizes.sm};
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: ${SPACING.xs};
`;

const FormInput = styled.input`
  padding: ${SPACING.md} ${SPACING.lg};
  border: 2px solid ${({ error }) => error ? COLORS.danger : COLORS.borderLight};
  border-radius: ${BORDER_RADIUS.lg};
  font-size: ${TYPOGRAPHY.fontSizes.base};
  transition: all ${TRANSITIONS.normal} ease;
  background: rgba(255, 255, 255, 0.7);
  color: ${COLORS.textPrimary};
  font-family: inherit;
  position: relative;
  z-index: 2;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 4px ${COLORS.primary}20, 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: ${COLORS.textTertiary};
    font-size: ${TYPOGRAPHY.fontSizes.sm};
  }
  
  &:hover:not(:focus) {
    border-color: ${COLORS.primaryLight};
    background: rgba(255, 255, 255, 0.9);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: ${BREAKPOINTS.sm}) {
    background: ${COLORS.bgPrimary};
  }
`;

const FormError = styled.div`
  color: ${COLORS.danger};
  font-size: ${TYPOGRAPHY.fontSizes.xs};
  margin-top: 2px;
  font-weight: ${TYPOGRAPHY.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${SPACING.px};
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: ${SPACING.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: ${SPACING.xs};
  color: ${COLORS.textSecondary};
  transition: color ${TRANSITIONS.fast} ease;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${COLORS.primary};
  }
  
  &:focus {
    outline: none;
    color: ${COLORS.primary};
  }
`;

const ForgotPasswordLink = styled(Link)`
  color: ${COLORS.primary};
  font-size: ${TYPOGRAPHY.fontSizes.sm};
  text-decoration: none;
  transition: all ${TRANSITIONS.normal} ease;
  font-weight: ${TYPOGRAPHY.fontWeights.medium};
  
  &:hover {
    color: ${COLORS.primaryDark};
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-decoration-skip-ink: none;
  }
`;

const RegisterLinkContainer = styled.div`
  text-align: center;
  margin-top: ${SPACING.lg};
  color: ${COLORS.textSecondary};
  font-size: ${TYPOGRAPHY.fontSizes.sm};
`;

const RegisterLink = styled(Link)`
  color: ${COLORS.primary};
  font-weight: ${TYPOGRAPHY.fontWeights.semibold};
  text-decoration: none;
  transition: all ${TRANSITIONS.normal} ease;
  position: relative;
  
  & .underline-animation {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${COLORS.primary};
    transition: width ${TRANSITIONS.normal} ease;
  }
  
  &:hover .underline-animation {
    width: 100%;
  }
  
  &:hover {
    color: ${COLORS.primaryDark};
  }
`;

const SocialLoginContainer = styled.div`
  margin-top: ${SPACING.lg};
  text-align: center;
`;

const SocialLoginDivider = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${SPACING.lg};
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${COLORS.borderLight};
  }
  
  &::before {
    margin-right: ${SPACING.sm};
  }
  
  &::after {
    margin-left: ${SPACING.sm};
  }
`;

const SocialLoginText = styled.span`
  color: ${COLORS.textTertiary};
  font-size: ${TYPOGRAPHY.fontSizes.sm};
  font-weight: ${TYPOGRAPHY.fontWeights.medium};
  white-space: nowrap;
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${SPACING.md};
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid ${COLORS.borderLight};
  border-radius: ${BORDER_RADIUS.full};
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all ${TRANSITIONS.normal} ease;
  font-size: 20px;
  z-index: 2;
  position: relative;
  
  &:hover {
    background: ${COLORS.bgSecondary};
    border-color: ${COLORS.primaryLight};
    transform: translateY(-2px) scale(1.05);
    box-shadow: ${SHADOWS.md};
  }
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 3px ${COLORS.primary}20;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: ${BREAKPOINTS.sm}) {
    background: ${COLORS.bgPrimary};
  }
`;

export default Login;