import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled from 'styled-components';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilters, setUserFilters] = useState({ role: 'All' });

  // Check if user is authenticated and has admin role
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch statistics
        const statsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStats(statsResponse.data);

        // Fetch recent users
        const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users?limit=10&page=1`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(usersResponse.data.users);

        // Fetch recent jobs
        const jobsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/jobs?limit=10&page=1`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setJobs(jobsResponse.data.jobs);

        // Fetch recent applications
        const appsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/applications?limit=10&page=1`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setApplications(appsResponse.data);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Handle user search
  const handleUserSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle user filter change
  const handleUserFilterChange = (e) => {
    setUserFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userFilters.role === 'All' || user.role === userFilters.role;
    return matchesSearch && matchesRole;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get role badge color
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#ef4444'; // Red
      case 'employer':
        return '#3b82f6'; // Blue
      case 'jobseeker':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#10b981'; // Green
      case 'Closed':
        return '#ef4444'; // Red
      case 'Draft':
        return '#f59e0b'; // Orange
      default:
        return '#6b7280'; // Gray
    }
  };

  // Get application status color
  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return '#6b7280'; // Gray
      case 'Reviewed':
        return '#3b82f6'; // Blue
      case 'Interview':
        return '#f59e0b'; // Orange
      case 'Accepted':
        return '#10b981'; // Green
      case 'Rejected':
        return '#ef4444'; // Red
      default:
        return '#6b7280';
    }
  };

  // Navigate to detailed pages
  const navigateToUsers = () => navigate('/users');
  const navigateToJobs = () => navigate('/jobs');
  const navigateToApplications = () => navigate('/applications');

  return (
    <AdminDashboardContainer>
      <PageHeader>
        <PageTitle>Admin Dashboard</PageTitle>
        <PageSubtitle>Manage users, jobs, and applications on the platform</PageSubtitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TabsContainer>
        <TabButton 
          isActive={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </TabButton>
        <TabButton 
          isActive={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </TabButton>
        <TabButton 
          isActive={activeTab === 'jobs'} 
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </TabButton>
        <TabButton 
          isActive={activeTab === 'applications'} 
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </TabButton>
      </TabsContainer>

      <ContentContainer>
        {loading ? (
          <LoadingMessage>Loading dashboard data...</LoadingMessage>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewSection>
                <StatsCards>
                  <StatCard>
                    <StatCardTitle>Total Users</StatCardTitle>
                    <StatCardValue>{stats.users}</StatCardValue>
                    <ViewAllButton onClick={navigateToUsers}>View All</ViewAllButton>
                  </StatCard>
                  <StatCard>
                    <StatCardTitle>Total Jobs</StatCardTitle>
                    <StatCardValue>{stats.jobs}</StatCardValue>
                    <ViewAllButton onClick={navigateToJobs}>View All</ViewAllButton>
                  </StatCard>
                  <StatCard>
                    <StatCardTitle>Total Applications</StatCardTitle>
                    <StatCardValue>{stats.applications}</StatCardValue>
                    <ViewAllButton onClick={navigateToApplications}>View All</ViewAllButton>
                  </StatCard>
                </StatsCards>
              </OverviewSection>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <UsersSection>
                <UsersHeader>
                  <SectionTitle>Manage Users</SectionTitle>
                  <UserFilters>
                    <SearchInput
                      type="text"
                      placeholder="Search users by name or email"
                      value={searchTerm}
                      onChange={handleUserSearch}
                    />
                    <RoleFilter
                      name="role"
                      value={userFilters.role}
                      onChange={handleUserFilterChange}
                    >
                      <option value="All">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="employer">Employer</option>
                      <option value="jobseeker">Jobseeker</option>
                    </RoleFilter>
                  </UserFilters>
                </UsersHeader>

                <UsersTable>
                  <TableHeader>
                    <TableHeaderCell>User ID</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Role</TableHeaderCell>
                    <TableHeaderCell>Created At</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <TableRow key={user._id}>
                          <TableCell>{user._id.substring(0, 8)}...</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <RoleBadge color={getRoleColor(user.role)}>
                              {user.role}
                            </RoleBadge>
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <ActionButton onClick={() => navigate(`/user/${user._id}`)}>
                              View
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="6" className="text-center">
                          {searchTerm ? 'No users found matching your search' : 'No users available'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UsersTable>
                <ViewAllButton onClick={navigateToUsers} className="mt-4">View All Users</ViewAllButton>
              </UsersSection>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <JobsSection>
                <SectionTitle>Recent Jobs</SectionTitle>
                <JobsTable>
                  <TableHeader>
                    <TableHeaderCell>Job Title</TableHeaderCell>
                    <TableHeaderCell>Company</TableHeaderCell>
                    <TableHeaderCell>Employer</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Applications</TableHeaderCell>
                    <TableHeaderCell>Created At</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableHeader>
                  <TableBody>
                    {jobs.length > 0 ? (
                      jobs.map(job => (
                        <TableRow key={job._id}>
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.employer?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <StatusBadge color={getStatusColor(job.status)}>
                              {job.status}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>{job.applications || 0}</TableCell>
                          <TableCell>{formatDate(job.createdAt)}</TableCell>
                          <TableCell>
                            <ActionButton onClick={() => navigate(`/job/${job._id}`)}>
                              View
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="7" className="text-center">
                          No jobs available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </JobsTable>
                <ViewAllButton onClick={navigateToJobs} className="mt-4">View All Jobs</ViewAllButton>
              </JobsSection>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <ApplicationsSection>
                <SectionTitle>Recent Applications</SectionTitle>
                <ApplicationsTable>
                  <TableHeader>
                    <TableHeaderCell>Job Title</TableHeaderCell>
                    <TableHeaderCell>Applicant</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Match Score</TableHeaderCell>
                    <TableHeaderCell>Applied At</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableHeader>
                  <TableBody>
                    {applications.length > 0 ? (
                      applications.map(app => (
                        <TableRow key={app._id}>
                          <TableCell>{app.job?.title || 'N/A'}</TableCell>
                          <TableCell>{app.user?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <StatusBadge color={getApplicationStatusColor(app.status)}>
                              {app.status}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>{app.matchScore || 0}%</TableCell>
                          <TableCell>{formatDate(app.createdAt)}</TableCell>
                          <TableCell>
                            <ActionButton onClick={() => navigate(`/application/${app._id}`)}>
                              View
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="6" className="text-center">
                          No applications available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </ApplicationsTable>
                <ViewAllButton onClick={navigateToApplications} className="mt-4">View All Applications</ViewAllButton>
              </ApplicationsSection>
            )}
          </>
        )}
      </ContentContainer>
    </AdminDashboardContainer>
  );
};

// Styled components
const AdminDashboardContainer = styled.div`
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
  font-size: 1rem;
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

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: #6b7280;
`;

// Overview Section
const OverviewSection = styled.div`
  margin-top: 2rem;
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
`;

const StatCardValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const ViewAllButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-start;

  &:hover {
    background-color: #2563eb;
  }
`;

// Users Section
const UsersSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const UsersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const UserFilters = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  min-width: 200px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const RoleFilter = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

// Table styles
const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const JobsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ApplicationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f9fafb;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.875rem;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #4b5563;

  &.text-center {
    text-align: center;
  }
`;

const RoleBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: ${({ color }) => color || '#6b7280'};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: ${({ color }) => color || '#6b7280'};
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;

  &:hover {
    background-color: #2563eb;
  }
`;

// Jobs Section
const JobsSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// Applications Section
const ApplicationsSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export default AdminDashboard;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`);
      setUsers(response.data);
    } catch (error) {
      addNotification({ message: 'Failed to fetch users', type: 'error' });
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/jobs`);
      setJobs(response.data);
    } catch (error) {
      addNotification({ message: 'Failed to fetch jobs', type: 'error' });
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        addNotification({ message: 'User deleted successfully', type: 'success' });
      } catch (error) {
        addNotification({ message: 'Failed to delete user', type: 'error' });
        console.error('Error deleting user:', error);
      }
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/jobs/${jobId}`);
        setJobs(jobs.filter(job => job.id !== jobId));
        addNotification({ message: 'Job deleted successfully', type: 'success' });
      } catch (error) {
        addNotification({ message: 'Failed to delete job', type: 'error' });
        console.error('Error deleting job:', error);
      }
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/status`, {
        active: !user.active
      });
      setUsers(users.map(user => user.id === userId ? response.data : user));
      addNotification({ 
        message: `User ${response.data.active ? 'activated' : 'deactivated'} successfully`, 
        type: 'success' 
      });
    } catch (error) {
      addNotification({ message: 'Failed to update user status', type: 'error' });
      console.error('Error updating user status:', error);
    }
  };

  const toggleJobStatus = async (jobId) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/jobs/${jobId}/status`, {
        active: !job.active
      });
      setJobs(jobs.map(job => job.id === jobId ? response.data : job));
      addNotification({ 
        message: `Job ${response.data.active ? 'activated' : 'deactivated'} successfully`, 
        type: 'success' 
      });
    } catch (error) {
      addNotification({ message: 'Failed to update job status', type: 'error' });
      console.error('Error updating job status:', error);
    }
  };