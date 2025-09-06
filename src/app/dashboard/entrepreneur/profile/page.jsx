'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../../../Redux/Slices/AuthSlice';
import { FiEdit, FiSave, FiX, FiUpload } from 'react-icons/fi';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    profileImage: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.full_name || '',
        title: user.title || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        profileImage: user.profile_image_url || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/profile-image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Image upload failed');
        setProfile({ ...profile, profileImage: data.user.profile_image_url });
        dispatch(loginUser({ user: data.user, token: localStorage.getItem('token') }));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fullName: profile.name,
          title: profile.title,
          bio: profile.bio,
          phone: profile.phone,
          website: profile.website,
          linkedin: profile.linkedin,
          twitter: profile.twitter,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Profile update failed');
      dispatch(loginUser({ user: data.user, token: localStorage.getItem('token') }));
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#2C2C2C] px-4 py-6 sm:px-6 lg:px-10 text-[#E8E8E8] rounded-lg">
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[#383838] flex items-center justify-center overflow-hidden">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#D0140F]">
                  {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD'}
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
            <p className="text-sm text-[#9ca3af] mt-2 text-center md:text-left">
              Click to upload new photo
            </p>
          )}
        </div>
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