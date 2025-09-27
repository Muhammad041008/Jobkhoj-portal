import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled from 'styled-components';
import axios from 'axios';
import { jobService, applicationService } from '../services/apiService.js';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      // Use jobService.getJobById instead of direct axios call
      const data = await jobService.getJobById(id);
      setJob(data);
    } catch (err) {
      setError('Failed to fetch job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'jobseeker') {
      setError('Only job seekers can apply for jobs.');
      return;
    }
    
    setApplying(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('job', id);
      formData.append('coverLetter', coverLetter);
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      
      // Use applicationService.createApplication instead of direct axios call
      await applicationService.createApplication(formData);
      
      setApplicationSuccess(true);
      setCoverLetter('');
      setResumeFile(null);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to submit application. Please try again later.'
      );
    } finally {
      setApplying(false);
    }
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  if (loading) {
    return (
      <JobDetailContainer>
        <LoadingContainer>
          <LoadingText>Loading job details...</LoadingText>
        </LoadingContainer>
      </JobDetailContainer>
    );
  }

  if (error) {
    return (
      <JobDetailContainer>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton onClick={() => navigate(-1)}>Go Back</BackButton>
        </ErrorContainer>
      </JobDetailContainer>
    );
  }

  if (!job) {
    return (
      <JobDetailContainer>
        <ErrorContainer>
          <ErrorMessage>Job not found.</ErrorMessage>
          <BackButton onClick={() => navigate('/jobs')}>Browse Jobs</BackButton>
        </ErrorContainer>
      </JobDetailContainer>
    );
  }

  return (
    <JobDetailContainer>
      <BackButton onClick={() => navigate(-1)}>← Go Back</BackButton>
      
      <JobHeader>
        <JobInfo>
          <JobTitle>{job.title}</JobTitle>
          <JobCompany>{job.company}</JobCompany>
        </JobInfo>
        
        {user && user.role === 'jobseeker' && (
          <ApplyButton 
            as="button" 
            onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Apply Now
          </ApplyButton>
        )}
      </JobHeader>

      <JobContent>
        <MainContent>
          <JobMetaInfo>
            <MetaItem>
              <MetaIcon>📍</MetaIcon>
              <MetaText>{job.location}</MetaText>
            </MetaItem>
            
            <MetaItem>
              <MetaIcon>💼</MetaIcon>
              <MetaText>{job.jobType}</MetaText>
            </MetaItem>
            
            <MetaItem>
              <MetaIcon>💰</MetaIcon>
              <MetaText>
                {job.salary ? `$${job.salary.toLocaleString()} per year` : 'Not specified'}
              </MetaText>
            </MetaItem>
            
            <MetaItem>
              <MetaIcon>📅</MetaIcon>
              <MetaText>
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </MetaText>
            </MetaItem>
          </JobMetaInfo>

          <JobSection>
            <SectionTitle>Job Description</SectionTitle>
            <SectionContent>
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </SectionContent>
          </JobSection>

          <JobSection>
            <SectionTitle>Requirements</SectionTitle>
            <SectionContent>
              <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
            </SectionContent>
          </JobSection>

          <JobSection>
            <SectionTitle>Responsibilities</SectionTitle>
            <SectionContent>
              <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
            </SectionContent>
          </JobSection>

          <JobSection>
            <SectionTitle>Required Skills</SectionTitle>
            <SkillsContainer>
              {job.skills && job.skills.map((skill, index) => (
                <SkillTag key={index}>{skill}</SkillTag>
              ))}
            </SkillsContainer>
          </JobSection>

          {user && user.role === 'jobseeker' && (
            <ApplicationSection id="application-form">
              <SectionTitle>Apply for This Job</SectionTitle>
              
              {applicationSuccess ? (
                <SuccessMessage>
                  Your application has been submitted successfully!
                </SuccessMessage>
              ) : (
                <ApplicationForm onSubmit={handleApply}>
                  <FormGroup>
                    <FormLabel htmlFor="coverLetter">Cover Letter</FormLabel>
                    <TextArea
                      id="coverLetter"
                      name="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
                      rows="6"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="resume">Upload Resume (Optional)</FormLabel>
                    <FileInput
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                    />
                    <FileHint>
                      PDF, DOC, or DOCX format (max 5MB)
                    </FileHint>
                  </FormGroup>

                  <SubmitButton type="submit" disabled={applying}>
                    {applying ? 'Submitting Application...' : 'Submit Application'}
                  </SubmitButton>
                </ApplicationForm>
              )}
            </ApplicationSection>
          )}
        </MainContent>

        <Sidebar>
          <CompanyInfoCard>
            <CompanyInfoTitle>About the Company</CompanyInfoTitle>
            <CompanyInfoContent>
              {job.companyName ? (
                <CompanyName>{job.companyName}</CompanyName>
              ) : (
                <CompanyName>{job.company}</CompanyName>
              )}
              
              {job.companyDescription && (
                <CompanyDescription>
                  {job.companyDescription.substring(0, 200)}...
                </CompanyDescription>
              )}
              
              {job.companyWebsite && (
                <CompanyWebsite
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Company Website
                </CompanyWebsite>
              )}
            </CompanyInfoContent>
          </CompanyInfoCard>

          <JobStatsCard>
            <JobStatsTitle>Job Statistics</JobStatsTitle>
            <JobStatsContent>
              <StatItem>
                <StatLabel>Views</StatLabel>
                <StatValue>{job.views || 0}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Applications</StatLabel>
                <StatValue>{job.applications?.length || 0}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Experience Level</StatLabel>
                <StatValue>{job.experienceLevel || 'Not specified'}</StatValue>
              </StatItem>
              
              <StatItem>
                <StatLabel>Education Level</StatLabel>
                <StatValue>{job.educationLevel || 'Not specified'}</StatValue>
              </StatItem>
            </JobStatsContent>
          </JobStatsCard>

          {user && user.role === 'employer' && user._id === job.poster && (
            <EmployerActionsCard>
              <EmployerActionsTitle>Employer Actions</EmployerActionsTitle>
              <EmployerActionsContent>
                <EmployerActionButton 
                  as="button"
                  onClick={() => navigate(`/edit-job/${job._id}`)}
                >
                  Edit Job Post
                </EmployerActionButton>
                
                <EmployerActionButton 
                  as="button"
                  onClick={() => navigate(`/job-applications/${job._id}`)}
                >
                  View Applications
                </EmployerActionButton>
              </EmployerActionsContent>
            </EmployerActionsCard>
          )}
        </Sidebar>
      </JobContent>
    </JobDetailContainer>
  );
};

// Styled components
const JobDetailContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const JobCompany = styled.div`
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
`;

const ApplyButton = styled.a`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const JobContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const JobMetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  background-color: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaIcon = styled.span`
  font-size: 1.25rem;
`;

const MetaText = styled.span`
  color: #4b5563;
  font-weight: 500;
`;

const JobSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionContent = styled.div`
  color: #4b5563;
  line-height: 1.6;
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  strong {
    font-weight: 600;
    color: #1f2937;
  }
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SkillTag = styled.span`
  background-color: #e5e7eb;
  color: #4b5563;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.875rem;
`;

const ApplicationSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 1.5rem;
  border-radius: 4px;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
`;

const ApplicationForm = styled.form`
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

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FileInput = styled.input`
  font-size: 0.875rem;
`;

const FileHint = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #059669;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CompanyInfoCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CompanyInfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const CompanyInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CompanyName = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
`;

const CompanyDescription = styled.p`
  color: #4b5563;
  line-height: 1.5;
  font-size: 0.875rem;
`;

const CompanyWebsite = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const JobStatsCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const JobStatsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const JobStatsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const StatValue = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
`;

const EmployerActionsCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EmployerActionsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const EmployerActionsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EmployerActionButton = styled.a`
  padding: 0.75rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const LoadingText = styled.div`
  font-size: 1.125rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1.5rem;
`;

const ErrorMessage = styled.div`
  font-size: 1.125rem;
  color: #dc2626;
  text-align: center;
`;

export default JobDetail;