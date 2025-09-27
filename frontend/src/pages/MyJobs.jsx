import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import styled from 'styled-components';
import { jobService } from '../services/apiService';

const MyJobs = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is authenticated and has employer role
  if (!user || user.role !== 'employer') {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    fetchMyJobs();
  }, [activeTab, searchTerm]);

  const fetchMyJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobsData = await jobService.getMyJobs(activeTab);
      setJobs(jobsData);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await jobService.deleteJob(jobId);
        showNotification('Job deleted successfully', 'success');
        fetchMyJobs();
      } catch (err) {
        showNotification('Failed to delete job. Please try again later.', 'error');
        console.error('Error deleting job:', err);
      }
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await jobService.updateJobStatus(jobId, newStatus);
      showNotification('Job status updated successfully', 'success');
      fetchMyJobs();
    } catch (err) {
      showNotification('Failed to update job status. Please try again later.', 'error');
      console.error('Error updating job status:', err);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MyJobsContainer>
      <PageHeader>
        <PageTitle>My Job Postings</PageTitle>
        <PageSubtitle>Manage all your job postings in one place</PageSubtitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <JobControls>
        <SearchBar
          type="text"
          placeholder="Search your job postings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <PostJobButton onClick={() => navigate('/post-job')}>
          Post New Job
        </PostJobButton>
      </JobControls>

      <TabsContainer>
        <TabButton 
          isActive={activeTab === 'active'}
          onClick={() => setActiveTab('active')}
        >
          Active Jobs
        </TabButton>
        <TabButton 
          isActive={activeTab === 'inactive'}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive Jobs
        </TabButton>
        <TabButton 
          isActive={activeTab === 'filled'}
          onClick={() => setActiveTab('filled')}
        >
          Filled Jobs
        </TabButton>
      </TabsContainer>

      {loading ? (
        <LoadingContainer>
          <LoadingText>Loading your job postings...</LoadingText>
        </LoadingContainer>
      ) : (
        <JobsContainer>
          {filteredJobs.length === 0 ? (
            <NoJobsContainer>
              <NoJobsText>
                {searchTerm ? 'No matching job postings found.' : `No ${activeTab} job postings available.`}
              </NoJobsText>
              {!searchTerm && (
                <NoJobsSubtext>
                  {activeTab === 'active' ? 
                    'Create your first job posting to start hiring!' : 
                    'You have no job postings with this status.'}
                </NoJobsSubtext>
              )}
            </NoJobsContainer>
          ) : (
            <JobsList>
              {filteredJobs.map(job => (
                <JobCard key={job._id}>
                  <JobCardHeader>
                    <JobTitle>{job.title}</JobTitle>
                    <JobCompany>{job.company}</JobCompany>
                  </JobCardHeader>
                  
                  <JobDetails>
                    <JobDetailItem>
                      <DetailIcon>📍</DetailIcon>
                      <DetailText>{job.location}</DetailText>
                    </JobDetailItem>
                    
                    <JobDetailItem>
                      <DetailIcon>💼</DetailIcon>
                      <DetailText>{job.jobType}</DetailText>
                    </JobDetailItem>
                    
                    <JobDetailItem>
                      <DetailIcon>💰</DetailIcon>
                      <DetailText>
                        {job.salary ? `$${job.salary.toLocaleString()}` : 'Not specified'}
                      </DetailText>
                    </JobDetailItem>
                    
                    <JobDetailItem>
                      <DetailIcon>📅</DetailIcon>
                      <DetailText>Posted on {new Date(job.createdAt).toLocaleDateString()}</DetailText>
                    </JobDetailItem>
                    
                    <JobDetailItem>
                      <DetailIcon>👥</DetailIcon>
                      <DetailText>{job.applications?.length || 0} applications</DetailText>
                    </JobDetailItem>
                  </JobDetails>
                  
                  <JobCardFooter>
                    <StatusBadge status={job.status}>
                      {job.status}
                    </StatusBadge>
                    
                    <JobActions>
                      <ActionButton 
                        onClick={() => navigate(`/job/${job._id}`)}
                        variant="primary"
                      >
                        View Job
                      </ActionButton>
                      <ActionButton 
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                        variant="secondary"
                      >
                        Edit
                      </ActionButton>
                      <ActionButton 
                        onClick={() => navigate(`/job-applications/${job._id}`)}
                        variant="secondary"
                      >
                        View Applications
                      </ActionButton>
                      <ActionButton 
                        onClick={() => deleteJob(job._id)}
                        variant="danger"
                      >
                        Delete
                      </ActionButton>
                    </JobActions>
                  </JobCardFooter>
                </JobCard>
              ))}
            </JobsList>
          )}
        </JobsContainer>
      )}
    </MyJobsContainer>
  );
};

// Styled components
const MyJobsContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
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

const JobControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SearchBar = styled.input`
  flex: 1;
  min-width: 300px;
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

const PostJobButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #e5e7eb;
  color: #4b5563;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: #d1d5db;
  }
  
  ${({ isActive }) => isActive && `
    background-color: #3b82f6;
    color: white;
  `}
`;

const JobsContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
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

const NoJobsContainer = styled.div`
  background-color: white;
  padding: 3rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const NoJobsText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const NoJobsSubtext = styled.div`
  color: #6b7280;
`;

const JobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const JobCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const JobCardHeader = styled.div`
  margin-bottom: 1rem;
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
`;

const JobCompany = styled.div`
  color: #6b7280;
  font-weight: 500;
`;

const JobDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const JobDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const DetailIcon = styled.span`
  font-size: 1rem;
`;

const DetailText = styled.span`
  margin-left: 0.25rem;
`;

const JobCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: ${props => {
    switch (props.status.toLowerCase()) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'filled': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const JobActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
          
          &:hover {
            background-color: #2563eb;
          }
        `;
      case 'secondary':
        return `
          background-color: #e5e7eb;
          color: #4b5563;
          
          &:hover {
            background-color: #d1d5db;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          
          &:hover {
            background-color: #dc2626;
          }
        `;
      default:
        return `
          background-color: #e5e7eb;
          color: #4b5563;
        `;
    }
  }}
`;

export default MyJobs;