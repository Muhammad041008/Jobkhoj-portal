import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled from 'styled-components';
import axios from 'axios';
import { applicationService } from '../services/apiService.js';

const Applications = () => {
  const { user, hasRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch applications based on user role
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use applicationService based on user role
        let data;
        
        if (hasRole('jobseeker')) {
          // Jobseeker sees their own applications
          data = await applicationService.getMyApplications();
        } else if (hasRole('employer')) {
          // Employer sees applications for their jobs
          data = await applicationService.getEmployerApplications();
        } else if (hasRole('admin')) {
          // Admin sees all applications
          data = await applicationService.getApplications();
        } else {
          throw new Error('Unauthorized access to applications');
        }
        
        setApplications(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch applications');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user, hasRole]);

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = !filters.search || 
      (app.jobTitle && app.jobTitle.toLowerCase().includes(filters.search.toLowerCase())) ||
      (app.jobId && app.jobId.toLowerCase().includes(filters.search.toLowerCase())) ||
      (app.applicantName && app.applicantName.toLowerCase().includes(filters.search.toLowerCase())) ||
      (app.status && app.status.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || app.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  // Handle status update for an application
  const handleStatusUpdate = async () => {
    if (!selectedApplication || !statusUpdate) return;
    
    try {
        // First update the application status
        const updatedData = await applicationService.updateApplicationStatus(selectedApplication._id, statusUpdate);
        
        // Then add notes if provided
        let finalData = updatedData;
        if (notes.trim()) {
          finalData = await applicationService.addNotes(selectedApplication._id, notes);
        }
        
        setApplications(applications.map(app => 
          app._id === selectedApplication._id ? finalData : app
        ));
        setSelectedApplication(finalData);
        setStatusUpdate('');
        setNotes('');
      } catch (err) {
        console.error('Error updating application:', err);
        setError('Failed to update application');
      }
  };

  // Handle delete application
  const handleDelete = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    
    try {
      // Use applicationService.deleteApplication instead of direct axios call
      await applicationService.deleteApplication(applicationId);
      
      setApplications(applications.filter(app => app._id !== applicationId));
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Failed to delete application');
    }
  };

  // Handle application detail view
  const handleViewDetail = (application) => {
    setSelectedApplication(application);
    setStatusUpdate(application.status || '');
    setNotes(application.notes || '');
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Render application list
  const renderApplicationList = () => {
    if (loading) {
      return <LoadingMessage>Loading applications...</LoadingMessage>;
    }
    
    if (error) {
      return <ErrorMessage>Error: {error}</ErrorMessage>;
    }
    
    if (filteredApplications.length === 0) {
      return <EmptyMessage>No applications found</EmptyMessage>;
    }
    
    return (
      <ApplicationList>
        {filteredApplications.map(application => (
          <ApplicationCard 
            key={application._id} 
            isSelected={selectedApplication && selectedApplication._id === application._id}
            onClick={() => handleViewDetail(application)}
          >
            <CardHeader>
              <JobTitle>{application.jobTitle || 'Job'}</JobTitle>
              <Status status={application.status}>{application.status || 'Pending'}</Status>
            </CardHeader>
            <ApplicantInfo>
              {hasRole('employer') && (
                <ApplicantName>{application.applicantName || 'Applicant'}</ApplicantName>
              )}
              <ApplicationDate>Applied on: {new Date(application.createdAt).toLocaleDateString()}</ApplicationDate>
            </ApplicantInfo>
          </ApplicationCard>
        ))}
      </ApplicationList>
    );
  };

  // Render application detail
  const renderApplicationDetail = () => {
    if (!selectedApplication) {
      return <DetailPlaceholder>Select an application to view details</DetailPlaceholder>;
    }
    
    return (
      <DetailContainer>
        <DetailHeader>
          <h2>{selectedApplication.jobTitle || 'Job'}</h2>
          {hasRole('admin') && (
            <DeleteButton onClick={() => handleDelete(selectedApplication._id)}>
              Delete Application
            </DeleteButton>
          )}
        </DetailHeader>
        
        <DetailSection>
          <SectionTitle>Application Information</SectionTitle>
          <InfoRow>
            <InfoLabel>Application ID:</InfoLabel>
            <InfoValue>{selectedApplication._id}</InfoValue>
          </InfoRow>
          {hasRole('jobseeker') && (
            <InfoRow>
              <InfoLabel>Job ID:</InfoLabel>
              <InfoValue>{selectedApplication.jobId}</InfoValue>
            </InfoRow>
          )}
          <InfoRow>
            <InfoLabel>Applied On:</InfoLabel>
            <InfoValue>{new Date(selectedApplication.createdAt).toLocaleDateString()}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Last Updated:</InfoLabel>
            <InfoValue>{selectedApplication.updatedAt ? new Date(selectedApplication.updatedAt).toLocaleDateString() : 'Not updated'}</InfoValue>
          </InfoRow>
        </DetailSection>
        
        {hasRole('employer') || hasRole('admin') && (
          <DetailSection>
            <SectionTitle>Applicant Information</SectionTitle>
            <InfoRow>
              <InfoLabel>Name:</InfoLabel>
              <InfoValue>{selectedApplication.applicantName || 'N/A'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{selectedApplication.applicantEmail || 'N/A'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Resume:</InfoLabel>
              <InfoValue>
                {selectedApplication.resumeUrl ? (
                  <a href={selectedApplication.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                ) : 'No resume uploaded'}
              </InfoValue>
            </InfoRow>
          </DetailSection>
        )}
        
        {(hasRole('employer') || hasRole('admin')) && (
          <DetailSection>
            <SectionTitle>Update Status</SectionTitle>
            <StatusForm>
              <StatusSelect 
                name="statusUpdate" 
                value={statusUpdate} 
                onChange={(e) => setStatusUpdate(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </StatusSelect>
              
              <NotesTextarea 
                placeholder="Add notes..." 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
              />
              
              <UpdateButton onClick={handleStatusUpdate}>
                Update Status
              </UpdateButton>
            </StatusForm>
          </DetailSection>
        )}
        
        {selectedApplication.notes && (
          <DetailSection>
            <SectionTitle>Notes</SectionTitle>
            <NotesDisplay>{selectedApplication.notes}</NotesDisplay>
          </DetailSection>
        )}
      </DetailContainer>
    );
  };

  return (
    <ApplicationsContainer>
      <PageHeader>
        <h1>Applications</h1>
        <FilterControls>
          <SearchInput 
            type="text" 
            name="search" 
            placeholder="Search applications..." 
            value={filters.search} 
            onChange={handleFilterChange}
          />
          <StatusFilter 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </StatusFilter>
        </FilterControls>
      </PageHeader>
      
      <ContentWrapper>
        <ListSection>
          {renderApplicationList()}
        </ListSection>
        
        <DetailSectionWrapper>
          {renderApplicationDetail()}
        </DetailSectionWrapper>
      </ContentWrapper>
    </ApplicationsContainer>
  );
};

// Styled Components
const ApplicationsContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;

const StatusFilter = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ListSection = styled.div`
  max-height: 80vh;
  overflow-y: auto;
`;

const DetailSectionWrapper = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  border-left: 1px solid #eee;
  padding-left: 20px;
`;

const ApplicationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ApplicationCard = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isSelected ? '#f0f7ff' : '#fff'};
  border-color: ${props => props.isSelected ? '#3498db' : '#ddd'};
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const JobTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const Status = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    switch (props.status) {
      case 'pending': return '#f39c12';
      case 'reviewed': return '#3498db';
      case 'interview': return '#8e44ad';
      case 'rejected': return '#e74c3c';
      case 'accepted': return '#2ecc71';
      default: return '#95a5a6';
    }
  }};
`;

const ApplicantInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
`;

const ApplicantName = styled.span`
  font-weight: 500;
`;

const ApplicationDate = styled.span`
  font-size: 12px;
`;

const DetailContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const DetailSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const InfoLabel = styled.span`
  width: 120px;
  font-weight: 500;
  color: #666;
`;

const InfoValue = styled.span`
  flex: 1;
  color: #333;
`;

const StatusForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StatusSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const NotesTextarea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
`;

const NotesDisplay = styled.div`
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 4px solid #3498db;
`;

const UpdateButton = styled.button`
  padding: 10px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #e74c3c;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const DetailPlaceholder = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-style: italic;
`;

export default Applications;