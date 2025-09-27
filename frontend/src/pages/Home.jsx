import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled from 'styled-components';
import Button from '../components/Button.jsx';

const Home = () => {
  const { user } = useAuth();

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find Your Perfect Job Match</HeroTitle>
          <HeroDescription>
            Connecting talented job seekers with their dream employers.
            Discover opportunities or find the perfect candidate today.
          </HeroDescription>
          <CTAButtons>
            {user ? (
              <Button as={Link} to={user.role === 'jobseeker' ? '/jobs' : '/post-job'} variant="primary" size="large">
                {user.role === 'jobseeker' ? 'Browse Jobs' : 'Post a Job'}
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="primary" size="large">Login</Button>
                <Button as={Link} to="/register" variant="secondary" size="large">Register</Button>
              </>
            )}
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionTitle>Why Choose JobKhoj?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>Advanced Job Search</FeatureTitle>
            <FeatureDescription>
              Find jobs that match your skills, experience, and preferences with our powerful search filters.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📄</FeatureIcon>
            <FeatureTitle>Easy Application Process</FeatureTitle>
            <FeatureDescription>
              Apply to jobs in just a few clicks with your stored resume and cover letter.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>💼</FeatureIcon>
            <FeatureTitle>Employer Tools</FeatureTitle>
            <FeatureDescription>
              Post jobs, manage applications, and find the perfect candidates for your company.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI Matching</FeatureTitle>
            <FeatureDescription>
              Our smart algorithm matches job seekers with the most suitable opportunities.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* Stats Section */}
      <StatsSection>
        <StatsGrid>
          <StatCard>
            <StatNumber>10,000+</StatNumber>
            <StatLabel>Jobs Posted</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>5,000+</StatNumber>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>3,000+</StatNumber>
            <StatLabel>Successful Hires</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>1,000+</StatNumber>
            <StatLabel>Partner Companies</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <SectionTitle>What Our Users Say</SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <TestimonialText>
              "JobKhoj helped me find my dream job within a week! The interface is user-friendly and the job recommendations were spot on."
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorName>Jane Doe</AuthorName>
              <AuthorRole>Software Engineer</AuthorRole>
            </TestimonialAuthor>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialText>
              "As an employer, we've found amazing talent through JobKhoj. The application management tools make the hiring process so much easier."
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorName>John Smith</AuthorName>
              <AuthorRole>HR Director</AuthorRole>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>
    </HomeContainer>
  );
};

// Styled components
const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background-color: #f9fafb;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #4b5563;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background-color: white;
  padding: 4rem 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const StatCard = styled.div`
  padding: 1.5rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #4b5563;
  font-weight: 500;
`;

const TestimonialsSection = styled.section`
  padding: 6rem 2rem;
  background-color: #f3f4f6;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TestimonialText = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  text-align: right;
`;

const AuthorName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const AuthorRole = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export default Home;