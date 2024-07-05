'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type ExtendedSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  dateOfBirth?: string | null;
  mobileNumber?: string | null;
  gender?: string | null;
  profilePicture?: string | null;
};

const Profile: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [displayProfilePic, setDisplayProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const user = await response.json() as ExtendedSessionUser;
        setName(user.name || '');
        setEmail(user.email || '');
        setDateOfBirth(user.dateOfBirth || '');
        setMobileNumber(user.mobileNumber || '');
        setGender(user.gender || '');
        setDisplayProfilePic(user.profilePicture || null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data.', {
          position: 'bottom-right',
        });
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('mobileNumber', mobileNumber);
      formData.append('gender', gender);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch(`/api/profile/${(session?.user as ExtendedSessionUser).id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const data = await response.json();

      if (data.user.profilePicture) {
        setDisplayProfilePic(data.user.profilePicture);
      }
      toast.success('Profile updated successfully!', {
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update profile.', {
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setDisplayProfilePic(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 overflow-y-auto max-h-screen">
      <h2 className="text-2xl mb-6">Profile</h2>
      <div className="flex items-center mb-6">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
          {displayProfilePic ? (
            <img src={displayProfilePic} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <svg
              className="h-full w-full text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )}
        </div>
        <label
          htmlFor="profilePicInput"
          className="ml-4 cursor-pointer text-sm font-medium text-blue-600"
        >
          Change Picture
        </label>
        <input
          id="profilePicInput"
          type="file"
          accept=".jpeg, .jpg, .png"
          onChange={handleProfilePicChange}
          className="hidden"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <input
          type="tel"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button
          onClick={handleSave}
          className={`bg-blue-600 text-white mt-3 px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
