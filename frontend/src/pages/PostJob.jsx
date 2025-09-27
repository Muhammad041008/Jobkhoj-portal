import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AuthContext } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled from 'styled-components';
import axios from 'axios';
import { jobService } from '../services/apiService.js';

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    responsibilities: '',
    skills: '',
    experienceLevel: 'Mid Level',
    educationLevel: 'Bachelors',
    status: 'Active'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated and has employer role
  if (!user || user.role !== 'employer') {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Process skills string into an array
      const processedFormData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        salary: formData.salary ? parseInt(formData.salary) : 0
      };

      // Use jobService.createJob instead of direct axios call
      await jobService.createJob(processedFormData);

      setSuccess('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: 'Remote',
        jobType: 'Full-time',
        salary: '',
        description: '',
        requirements: '',
        responsibilities: '',
        skills: '',
        experienceLevel: 'Mid Level',
        educationLevel: 'Bachelors',
        status: 'Active'
      });

      // Redirect to job details page after successful posting
      setTimeout(() => {
        navigate(`/job/${response.data._id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PostJobContainer>
      <PageHeader>
        <PageTitle>Post a New Job</PageTitle>
        <PageSubtitle>Create a detailed job listing to attract qualified candidates</PageSubtitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <JobForm onSubmit={handleSubmit}>
        {/* Basic Job Information */}
        <FormSection>
          <SectionTitle>Basic Job Information</SectionTitle>
          <FormGrid>
            <FormGroup>
              <FormLabel htmlFor="title">Job Title *</FormLabel>
              <FormInput
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter job title"
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="company">Company Name *</FormLabel>
              <FormInput
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="location">Location *</FormLabel>
              <FormSelect
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="London">London</option>
                <option value="Berlin">Berlin</option>
                <option value="Tokyo">Tokyo</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="jobType">Job Type *</FormLabel>
              <FormSelect
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="salary">Salary (Annual)</FormLabel>
              <FormInput
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary without currency symbol"
                min="0"
              />
              <FormHint>Leave blank if salary is not disclosed</FormHint>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="status">Job Status *</FormLabel>
              <FormSelect
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </FormSelect>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Experience and Education */}
        <FormSection>
          <SectionTitle>Experience & Education</SectionTitle>
          <FormGrid>
            <FormGroup>
              <FormLabel htmlFor="experienceLevel">Experience Level *</FormLabel>
              <FormSelect
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
              >
                <option value="Entry Level">Entry Level (0-2 years)</option>
                <option value="Mid Level">Mid Level (2-5 years)</option>
                <option value="Senior Level">Senior Level (5-10 years)</option>
                <option value="Executive">Executive (10+ years)</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="educationLevel">Education Level</FormLabel>
              <FormSelect
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
              >
                <option value="">Not Specified</option>
                <option value="High School">High School</option>
                <option value="Associate's">Associate's Degree</option>
                <option value="Bachelor's">Bachelor's Degree</option>
                <option value="Master's">Master's Degree</option>
                <option value="PhD">PhD</option>
              </FormSelect>
            </FormGroup>
          </FormGrid>
        </FormSection>

        {/* Job Description */}
        <FormSection>
          <SectionTitle>Job Description *</SectionTitle>
          <FormGroup>
            <RichTextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the job..."
              required
            />
            <FormHint>Include information about the company, team, and what makes this role unique</FormHint>
          </FormGroup>
        </FormSection>

        {/* Job Requirements */}
        <FormSection>
          <SectionTitle>Requirements *</SectionTitle>
          <FormGroup>
            <RichTextArea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the required qualifications, skills, and experience..."
              required
            />
            <FormHint>Include technical skills, soft skills, certifications, and other qualifications</FormHint>
          </FormGroup>
        </FormSection>

        {/* Job Responsibilities */}
        <FormSection>
          <SectionTitle>Responsibilities *</SectionTitle>
          <FormGroup>
            <RichTextArea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Describe the key responsibilities of the role..."
              required
            />
            <FormHint>List day-to-day tasks, long-term objectives, and who the role reports to</FormHint>
          </FormGroup>
        </FormSection>

        {/* Skills */}
        <FormSection>
          <SectionTitle>Skills</SectionTitle>
          <FormGroup>
            <FormInput
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
            />
            <FormHint>Include technical skills, tools, and frameworks relevant to the role</FormHint>
          </FormGroup>
        </FormSection>

        {/* Form Actions */}
        <FormActions>
          <CancelButton type="button" onClick={() => navigate('/')}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting Job...' : 'Post Job'}
          </SubmitButton>
        </FormActions>
      </JobForm>
    </PostJobContainer>
  );
};

// Styled components
const PostJobContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const JobForm = styled.form`
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormSection = styled.div`
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
`;

const FormSelect = styled.select`
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

const RichTextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  min-height: 200px;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormHint = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #4b5563;
  }
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

export default PostJob;