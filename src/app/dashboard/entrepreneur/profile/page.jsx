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
    twitter: 'https://twitter.com/johndoe',
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
    console.log('Profile updated:', profile);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#2C2C2C] px-4 py-6 sm:px-6 lg:px-10 text-[#E8E8E8] rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Your Profile</h1>
        <div className="flex gap-2 flex-wrap">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 bg-[#D0140F] hover:bg-[#b9120d] text-white px-3 py-1 rounded-md"
              >
                <FiSave />
                <span>Save</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 bg-[#3F3F3F] text-[#E8E8E8] px-3 py-1 rounded-md"
              >
                <FiX />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 bg-[#D0140F] hover:bg-[#b9120d] text-white px-3 py-1 rounded-md"
            >
              <FiEdit />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[#383838] flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#D0140F]">JD</span>
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
            <p className="text-sm text-[#9ca3af] mt-2 text-center md:text-left">
              Click to upload new photo
            </p>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          {[
            { label: 'Full Name', name: 'name', value: profile.name },
            { label: 'Title', name: 'title', value: profile.title },
            { label: 'About', name: 'bio', value: profile.bio, textarea: true },
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
                    className="mt-1 block w-full rounded-md bg-[#383838] border border-[#3F3F3F] text-[#E8E8E8] p-2 focus:outline-none focus:ring-[#D0140F]"
                  />
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md bg-[#383838] border border-[#3F3F3F] text-[#E8E8E8] p-2 focus:outline-none focus:ring-[#D0140F]"
                  />
                )
              ) : (
                <p className={`${textarea ? 'text-[#9ca3af]' : 'text-lg font-semibold'}`}>{value}</p>
              )}
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['email', 'phone'].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#B3B3B3] capitalize">{key}</label>
                {isEditing ? (
                  <input
                    type={key === 'email' ? 'email' : 'tel'}
                    name={key}
                    value={profile[key]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md bg-[#383838] border border-[#3F3F3F] text-[#E8E8E8] p-2 focus:outline-none focus:ring-[#D0140F]"
                  />
                ) : (
                  <p className="text-[#9ca3af]">{profile[key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-medium text-[#B3B3B3] mb-2">Social Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['website', 'linkedin', 'twitter'].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-[#B3B3B3] capitalize">{key}</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name={key}
                      value={profile[key]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md bg-[#383838] border border-[#3F3F3F] text-[#E8E8E8] p-2 focus:outline-none focus:ring-[#D0140F]"
                    />
                  ) : (
                    <a
                      href={profile[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D0140F] hover:underline break-words"
                    >
                      {profile[key]}
                    </a>
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
