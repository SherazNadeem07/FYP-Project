'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';
import { FiEdit, FiSave, FiX, FiUpload } from 'react-icons/fi';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    title: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: '',
    profile_image_url: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch profile data on mount
  useEffect(() => {
    const storedToken = token || getCookie('token');
    if (!storedToken) {
      router.push('/auth');
      return;
    }
    fetchProfile(storedToken);
  }, [router, token]);

  const fetchProfile = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      setProfile({
        full_name: data.user.full_name || '',
        bio: data.user.bio || '',
        title: data.user.title || '',
        phone: data.user.phone || '',
        website: data.user.website || '',
        linkedin: data.user.linkedin || '',
        twitter: data.user.twitter || '',
        profile_image_url: data.user.profile_image_url || '',
      });
      setProfileImage(data.user.profile_image_url || null);
    } catch (err) {
      console.error('Error fetching profile:', err.message);
      setError(`Error fetching profile: ${err.message}`);
      if (err.message.includes('Unauthorized') || err.message.includes('Invalid token')) {
        router.push('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image to backend
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    const authToken = token || getCookie('token');
    if (!authToken) {
      setError('No authentication token found');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/profile-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload profile image');
      }

      const data = await response.json();
      setProfile((prev) => ({ ...prev, profile_image_url: data.user.profile_image_url }));
      alert('Profile image uploaded successfully!');
    } catch (err) {
      console.error('Error uploading profile image:', err.message);
      setError(`Error uploading profile image: ${err.message}`);
    }
  };

  const handleSave = async () => {
    const authToken = token || getCookie('token');
    if (!authToken) {
      setError('No authentication token found');
      router.push('/auth');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: profile.full_name,
          bio: profile.bio,
          title: profile.title,
          phone: profile.phone,
          website: profile.website,
          linkedin: profile.linkedin,
          twitter: profile.twitter,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile({
        full_name: data.user.full_name,
        bio: data.user.bio || '',
        title: data.user.title || '',
        phone: data.user.phone || '',
        website: data.user.website || '',
        linkedin: data.user.linkedin || '',
        twitter: data.user.twitter || '',
        profile_image_url: data.user.profile_image_url || '',
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err.message);
      setError(`Error updating profile: ${err.message}`);
      if (err.message.includes('Unauthorized') || err.message.includes('Invalid token')) {
        router.push('/auth');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#2C2C2C] p-4 sm:p-6 text-[#E8E8E8] rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Investor Profile</h1>
        {isEditing ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 bg-[#D0140F] hover:bg-[#b9120d] text-white px-3 py-1 rounded-md"
            >
              <FiSave />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center space-x-1 bg-[#3F3F3F] text-[#E8E8E8] px-3 py-1 rounded-md"
            >
              <FiX />
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 bg-[#D0140F] hover:bg-[#b9120d] text-white px-3 py-1 rounded-md"
          >
            <FiEdit />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[#383838] flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#D0140F]">
                  {profile.full_name ? profile.full_name[0] : 'U'}
                </span>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#2C2C2C] p-2 rounded-full shadow-md cursor-pointer">
                <FiUpload />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {isEditing && (
            <p className="text-sm text-[#9ca3af] mt-2">Click to upload new photo</p>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          {[
            { label: 'Full Name', name: 'full_name', value: profile.full_name },
            { label: 'Bio', name: 'bio', value: profile.bio, textarea: true },
            { label: 'Title/Background', name: 'title', value: profile.title },
            { label: 'Phone', name: 'phone', value: profile.phone },
            { label: 'Website', name: 'website', value: profile.website },
          ].map(({ label, name, value, textarea }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-[#B3B3B3]">{label}</label>
              {isEditing ? (
                textarea ? (
                  <textarea
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 w-full rounded-md bg-[#383838] border border-[#3F3F3F] text-[#E8E8E8] p-2 focus:outline-none focus:ring-[#D0140F]"
                  />
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md bg-[#383838] border border-[#3F3F3F] text-[#E8E8E8] p-2 focus:outline-none focus:ring-[#D0140F]"
                  />
                )
              ) : (
                <p className={`${textarea ? 'text-[#9ca3af]' : 'text-lg font-semibold'}`}>
                  {value || 'Not set'}
                </p>
              )}
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-medium text-[#B3B3B3] mb-2">Social Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['linkedin', 'twitter'].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-[#B3B3B3] capitalize">{key}</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name={key}
                      value={profile[key]}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md bg-[#383838] border border-[#3F3F3F] text-[#E8E8E8] p-2 focus:outline-none focus:ring-[#D0140F]"
                    />
                  ) : (
                    <p className="text-[#9ca3af]">{profile[key] || 'Not set'}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}