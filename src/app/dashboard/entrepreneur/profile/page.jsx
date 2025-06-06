'use client';
import { useState } from 'react';
import { FiEdit, FiSave, FiX, FiUpload } from 'react-icons/fi';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    title: 'Serial Entrepreneur',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Tech enthusiast with 5+ years of experience in building startups.',
    website: 'https://johndoe.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe'
  });
  const [profileImage, setProfileImage] = useState(null);

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
    }
  };

  const handleSave = () => {
    // Here you would typically send the updated profile to your backend
    console.log('Profile updated:', profile);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-1 rounded-md"
            >
              <FiSave />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center space-x-1 bg-gray-200 px-3 py-1 rounded-md"
            >
              <FiX />
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 bg-indigo-600 text-white px-3 py-1 rounded-md"
          >
            <FiEdit />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-indigo-600">JD</span>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
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
            <p className="text-sm text-gray-500 mt-2">Click to upload new photo</p>
          )}
        </div>

        {/* Profile Information */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            ) : (
              <p className="text-lg font-semibold">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Title</label>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            ) : (
              <p className="text-gray-600">{profile.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">About</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            ) : (
              <p className="text-gray-600">{profile.bio}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
              ) : (
                <p className="text-gray-600">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
              ) : (
                <p className="text-gray-600">{profile.phone}</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                ) : (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    {profile.website}
                  </a>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">LinkedIn</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                ) : (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    {profile.linkedin}
                  </a>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Twitter</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="twitter"
                    value={profile.twitter}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  />
                ) : (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    {profile.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}