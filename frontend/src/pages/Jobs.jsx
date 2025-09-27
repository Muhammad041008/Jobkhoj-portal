import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled from 'styled-components';
import axios from 'axios';
import { jobService } from '../services/apiService.js';
import { AuthContext } from '../context/AuthContext.jsx';

const Jobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salary: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters, currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Use jobService.getJobs instead of direct axios call
      const data = await jobService.getJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...jobs];

    // Filter by keyword
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(keyword)))
      );
    }

    // Filter by location
    if (filters.location) {
      result = result.filter(job => 
        job.location.toLowerCase() === filters.location.toLowerCase() ||
        job.location.toLowerCase() === 'remote'
      );
    }

    // Filter by job type
    if (filters.jobType) {
      result = result.filter(job => job.jobType === filters.jobType);
    }

    // Filter by experience level
    if (filters.experienceLevel) {
      result = result.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    // Filter by salary
    if (filters.salary) {
      const minSalary = parseInt(filters.salary);
      result = result.filter(job => job.salary >= minSalary);
    }

    // Pagination
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = result.slice(indexOfFirstJob, indexOfLastJob);

    setFilteredJobs(currentJobs);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      salary: ''
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <JobsContainer>
        <LoadingContainer>
          <LoadingText>Loading jobs...</LoadingText>
        </LoadingContainer>
      </JobsContainer>
    );
  }

  return (
    <JobsContainer>
      <PageHeader>
        <PageTitle>Find Jobs</PageTitle>
        {user?.role === 'employer' && (
          <PostJobButton as={Link} to="/post-job">
            Post a Job
          </PostJobButton>
        )}
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <JobsContent>
        {/* Search and Filters */}
        <FiltersContainer>
          <FiltersTitle>Filters</FiltersTitle>
          
          <FilterGroup>
            <FilterLabel htmlFor="keyword">Keyword</FilterLabel>
            <FilterInput
              type="text"
              id="keyword"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Job title, company, or skills"
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="location">Location</FilterLabel>
            <FilterSelect
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="London">London</option>
              <option value="Berlin">Berlin</option>
              <option value="Tokyo">Tokyo</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="jobType">Job Type</FilterLabel>
            <FilterSelect
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
              <option value="Internship">Internship</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="experienceLevel">Experience Level</FilterLabel>
            <FilterSelect
              id="experienceLevel"
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Executive">Executive</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel htmlFor="salary">Minimum Salary</FilterLabel>
            <FilterSelect
              id="salary"
              name="salary"
              value={filters.salary}
              onChange={handleFilterChange}
            >
              <option value="">Any Salary</option>
              <option value="30000">$30,000+</option>
              <option value="50000">$50,000+</option>
              <option value="75000">$75,000+</option>
              <option value="100000">$100,000+</option>
              <option value="150000">$150,000+</option>
            </FilterSelect>
          </FilterGroup>

          <ClearFiltersButton onClick={clearFilters}>
            Clear Filters
          </ClearFiltersButton>
        </FiltersContainer>

        {/* Job Listings */}
        <JobListingsContainer>
          <JobListingsHeader>
            <ResultsCount>
              Showing {filteredJobs.length} of {jobs.length} jobs
            </ResultsCount>
          </JobListingsHeader>

          {filteredJobs.length === 0 ? (
            <NoJobsContainer>
              <NoJobsText>No jobs found matching your criteria.</NoJobsText>
              <NoJobsSubtext>Try adjusting your filters or search keyword.</NoJobsSubtext>
            </NoJobsContainer>
          ) : (
            <JobsList>
              {filteredJobs.map(job => (
                <JobCard key={job._id} as={Link} to={`/job/${job._id}`}>
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
                      <DetailText>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </DetailText>
                    </JobDetailItem>
                  </JobDetails>
                  
                  <JobDescriptionPreview>
                    {job.description.substring(0, 150)}...
                  </JobDescriptionPreview>
                  
                  {job.skills && job.skills.length > 0 && (
                    <JobSkills>
                      {job.skills.slice(0, 5).map((skill, index) => (
                        <SkillTag key={index}>{skill}</SkillTag>
                      ))}
                      {job.skills.length > 5 && (
                        <SkillTag>+{job.skills.length - 5} more</SkillTag>
                      )}
                    </JobSkills>
                  )}
                </JobCard>
              ))}
            </JobsList>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                <PaginationButton
                  key={page}
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationButton>
              ))}
              
              <PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </JobListingsContainer>
      </JobsContent>
    </JobsContainer>
  );
};

// Styled components
const JobsContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const PostJobButton = styled.a`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const JobsContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FiltersContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 80px;
  height: fit-content;
  
  @media (max-width: 1024px) {
    position: static;
  }
`;

const FiltersTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ClearFiltersButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #4b5563;
  }
`;

const JobListingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const JobListingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ResultsCount = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
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

const JobCard = styled.a`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-2px);
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

const JobDescriptionPreview = styled.p`
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const JobSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  background-color: #e5e7eb;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background-color: ${props => props.isActive ? '#3b82f6' : 'white'};
  color: ${props => props.isActive ? 'white' : '#374151'};
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.isActive ? '600' : '500'};
  transition: background-color 0.2s, border-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.isActive ? '#2563eb' : '#f3f4f6'};
    border-color: ${props => props.isActive ? '#2563eb' : '#9ca3af'};
  }
  
  &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
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

export default Jobs;