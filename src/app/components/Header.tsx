'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut ,signIn} from "next-auth/react";
import toast from "react-hot-toast";
import { CgProfile } from "react-icons/cg";

type ExtendedSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  profilePicture?: string | null;
};

const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (session) {
        try {
          const response = await fetch('/api/profile');
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const user = await response.json() as ExtendedSessionUser;
          setProfilePicture(user.profilePicture || null);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to fetch user data.', {
            position: 'bottom-right',
          });
        }
      }
    };
    fetchProfilePicture();
  }, [session]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logout successful!", {
        position: "bottom-right",
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState); 
  };

  const closeDropdown = () => {
    setDropdownOpen(false); 
  };

  return (
    <header className="bg-blue-600 text-white fixed top-0 w-full h-[64px] flex items-center justify-between p-3">
      <h1 className="text-2xl">Dashboard</h1>
      {session ? (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-3 text-white px-3 py-2 rounded focus:outline-none"
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <CgProfile className="h-8 w-8" />
            )}
            <span className="flex gap-3 align-middle">{session.user.name}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    router.push("/profile");
                    closeDropdown();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    closeDropdown();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="bg-white text-blue-600 px-4 py-2 rounded"
        >
          Sign In
        </button>
      )}
    </header>
  );
};

export default Header;
