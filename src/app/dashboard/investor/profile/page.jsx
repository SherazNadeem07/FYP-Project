'use client';
import { useState } from 'react';
import { FiEdit, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    bio: "Angel investor with 5+ years experience in tech startups",
    company: "Johnson Capital",
    twitter: "@alexjohnson",
    linkedin: "linkedin.com/in/alexjohnson",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiSave className="mr-2" />
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <FiEdit className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-blue-600">AJ</span>
            </div>
            {isEditing ? (
              <input
                type="file"
                className="mb-4"
              />
            ) : null}
          </div>
        </div>
        
        <div className="w-full md:w-2/3 space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="p-2 border rounded-lg bg-gray-50">{profile.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="p-2 border rounded-lg bg-gray-50">{profile.bio}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Company/Background</label>
            {isEditing ? (
              <input
                type="text"
                name="company"
                value={profile.company}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="p-2 border rounded-lg bg-gray-50">{profile.company}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Social Links</h3>
            <div>
              <label className="block text-gray-700 mb-1">Twitter</label>
              {isEditing ? (
                <input
                  type="text"
                  name="twitter"
                  value={profile.twitter}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 border rounded-lg bg-gray-50">{profile.twitter}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">LinkedIn</label>
              {isEditing ? (
                <input
                  type="text"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="p-2 border rounded-lg bg-gray-50">{profile.linkedin}</p>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Change Password</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full p-2 border rounded-lg"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}