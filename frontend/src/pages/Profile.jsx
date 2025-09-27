import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import styled from 'styled-components';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';

const Profile = () => {
  const { user, updateProfile, uploadResume, uploadProfilePicture, logout } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'resume') {
      setResumeFile(files[0]);
    } else if (name === 'profilePicture') {
      setProfilePicFile(files[0]);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile(formData);
      addNotification({
        message: 'Profile updated successfully',
        type: 'success'
      });
      setIsEditing(false);
    } catch (err) {
      addNotification({
        message: err.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      await uploadResume(formData);
      addNotification({
        message: 'Resume uploaded successfully',
        type: 'success'
      });
      setResumeFile(null);
    } catch (err) {
      addNotification({
        message: err.message || 'Failed to upload resume',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadProfilePicture = async (e) => {
    e.preventDefault();
    if (!profilePicFile) return;
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePicFile);
      await uploadProfilePicture(formData);
      addNotification({
        message: 'Profile picture uploaded successfully',
        type: 'success'
      });
      setProfilePicFile(null);
    } catch (err) {
      addNotification({
        message: err.message || 'Failed to upload profile picture',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <PageTitle>My Profile</PageTitle>
        <div className="header-actions">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <>
              <Button onClick={() => {
                setIsEditing(false);
                setFormData(user);
              }} variant="secondary">Cancel</Button>
              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </ProfileHeader>

      <ProfileContent>
        {/* Basic Information */}
        <ProfileSection>
          <SectionTitle>Basic Information</SectionTitle>
          <ProfileInfo>
            <InfoRow>
              <InfoLabel>Name:</InfoLabel>
              {isEditing ? (
                <FormInput
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              ) : (
                <InfoValue>{formData.name}</InfoValue>
              )}
            </InfoRow>

            <InfoRow>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{formData.email}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Role:</InfoLabel>
              <InfoValue>
                {formData.role === 'jobseeker' && 'Job Seeker'}
                {formData.role === 'employer' && 'Employer'}
                {formData.role === 'admin' && 'Admin'}
              </InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Profile Picture:</InfoLabel>
              <InfoValue>
                {user.profilePicture ? (
                  <ProfilePictureContainer>
                    <ProfilePicture src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePicture}`} alt="Profile" />
                    {isEditing && (
                      <FileUploadForm onSubmit={handleUploadProfilePicture}>
                        <FileInput
                          type="file"
                          name="profilePicture"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <Button type="submit" disabled={isLoading || !profilePicFile}>
                        {isLoading ? 'Uploading...' : 'Update'}
                      </Button>
                      </FileUploadForm>
                    )}
                  </ProfilePictureContainer>
                ) : (
                  isEditing ? (
                    <FileUploadForm onSubmit={handleUploadProfilePicture}>
                      <FileInput
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button type="submit" disabled={isLoading || !profilePicFile}>
                        {isLoading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </FileUploadForm>
                  ) : (
                    <span>No profile picture uploaded</span>
                  )
                )}
              </InfoValue>
            </InfoRow>
          </ProfileInfo>
        </ProfileSection>

        {/* Role-specific Information */}
        {user.role === 'jobseeker' && (
          <ProfileSection>
            <SectionTitle>Job Seeker Information</SectionTitle>
            <ProfileInfo>
              <InfoRow>
                <InfoLabel>Resume:</InfoLabel>
                <InfoValue>
                  {user.resume ? (
                    <>
                      <a href={`${import.meta.env.VITE_API_URL}/uploads/${user.resume}`} target="_blank" rel="noopener noreferrer">
                        View Resume
                      </a>
                      {isEditing && (
                        <FileUploadForm onSubmit={handleUploadResume}>
                          <FileInput
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                          <Button type="submit" disabled={isLoading || !resumeFile}>
                            {isLoading ? 'Uploading...' : 'Update'}
                          </Button>
                        </FileUploadForm>
                      )}
                    </>
                  ) : (
                    isEditing ? (
                      <FileUploadForm onSubmit={handleUploadResume}>
                        <FileInput
                          type="file"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                        <Button type="submit" disabled={isLoading || !resumeFile}>
                            {isLoading ? 'Uploading...' : 'Upload'}
                          </Button>
                      </FileUploadForm>
                    ) : (
                      <span>No resume uploaded</span>
                    )
                  )}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Skills:</InfoLabel>
                {isEditing ? (
                  <FormInput
                    type="text"
                    name="skills"
                    value={formData.skills?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      skills: e.target.value.split(',').map(skill => skill.trim())
                    }))}
                    placeholder="Enter skills separated by commas"
                  />
                ) : (
                  <InfoValue>{formData.skills?.join(', ') || 'Not specified'}</InfoValue>
                )}
              </InfoRow>

              <InfoRow>
                <InfoLabel>Experience:</InfoLabel>
                {isEditing ? (
                  <TextArea
                    name="experience"
                    value={formData.experience || ''}
                    onChange={handleChange}
                    placeholder="Describe your work experience"
                  />
                ) : (
                  <InfoValue>{formData.experience || 'Not specified'}</InfoValue>
                )}
              </InfoRow>

              <InfoRow>
                <InfoLabel>Education:</InfoLabel>
                {isEditing ? (
                  <TextArea
                    name="education"
                    value={formData.education || ''}
                    onChange={handleChange}
                    placeholder="Describe your educational background"
                  />
                ) : (
                  <InfoValue>{formData.education || 'Not specified'}</InfoValue>
                )}
              </InfoRow>
            </ProfileInfo>
          </ProfileSection>
        )}

        {user.role === 'employer' && (
          <ProfileSection>
            <SectionTitle>Company Information</SectionTitle>
            <ProfileInfo>
              <InfoRow>
                <InfoLabel>Company Name:</InfoLabel>
                {isEditing ? (
                  <FormInput
                    type="text"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                ) : (
                  <InfoValue>{formData.companyName || 'Not specified'}</InfoValue>
                )}
              </InfoRow>

              <InfoRow>
                <InfoLabel>Company Description:</InfoLabel>
                {isEditing ? (
                  <TextArea
                    name="companyDescription"
                    value={formData.companyDescription || ''}
                    onChange={handleChange}
                    placeholder="Describe your company"
                  />
                ) : (
                  <InfoValue>{formData.companyDescription || 'Not specified'}</InfoValue>
                )}
              </InfoRow>

              <InfoRow>
                <InfoLabel>Company Website:</InfoLabel>
                {isEditing ? (
                  <FormInput
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite || ''}
                    onChange={handleChange}
                    placeholder="Enter company website"
                  />
                ) : (
                  formData.companyWebsite ? (
                    <a href={formData.companyWebsite} target="_blank" rel="noopener noreferrer">
                      {formData.companyWebsite}
                    </a>
                  ) : (
                    <InfoValue>Not specified</InfoValue>
                  )
                )}
              </InfoRow>
            </ProfileInfo>
          </ProfileSection>
        )}
      </ProfileContent>

      <LogoutContainer>
        <Button onClick={logout} variant="danger">
          Logout
        </Button>
      </LogoutContainer>
    </ProfileContainer>
  );
};

// Styled components
const ProfileContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .header-actions {
    display: flex;
    gap: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProfileSection = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InfoLabel = styled.div`
  flex: 0 0 150px;
  font-weight: 500;
  color: #374151;
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const InfoValue = styled.div`
  flex: 1;
  color: #4b5563;
  
  a {
    color: #3b82f6;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FormInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
`;

const FileUploadForm = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const FileInput = styled.input`
  font-size: 0.875rem;
`;

const LogoutContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

export default Profile;