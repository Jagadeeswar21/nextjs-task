'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import { IoNotificationsOutline, IoLogOutOutline } from "react-icons/io5";
import Profile from "./profilepage";
import Notifications from "./notifications";
import { AiOutlineUser } from "react-icons/ai";
import Image from "next/image";
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
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session) {
        try {
          const response = await fetch('/api/notifications');
          if (!response.ok) {
            throw new Error('Failed to fetch notifications');
          }
          const notifications = await response.json();
          const unreadCount = notifications.filter((notif: any) => !notif.read).length;
          setUnreadNotifications(unreadCount);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [session, showNotifications]);

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

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    closeDropdown();
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      setUnreadNotifications(0);
    }
  };

  return (
    <>
      <header className="bg-white text-white border-b-2 shadow-lg fixed top-0 w-full h-[64px] flex items-center justify-between p-3 z-50">
      <div className="px-10">
      <Image src="/logo.png" alt="Logo" width={70} height={20} />
      </div>
        {session ? (
          <div className="flex items-center gap-4 relative">
            <button
              onClick={toggleNotifications}
              className="relative text-white focus:outline-none"
            >
              <IoNotificationsOutline className="h-6 w-6 size-6 text-black" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-600 rounded-full"></span>
              )}
            </button>
            <div className="relative z-50">
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
                <span className="flex gap-3 align-middle text-black font-bold text-lg">{session.user.name}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={toggleProfile}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white gap-2"
                    >
                      <AiOutlineUser className="h-5 w-5" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeDropdown();
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white gap-2"
                    >
                      
                      <IoLogOutOutline className="h-5 w-5" /> <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 relative">
            <button
              onClick={toggleProfile}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
            <Profile onClose={toggleProfile} />
          </div>
        </div>
      )}
      {showNotifications && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 relative">
            <button
              onClick={toggleNotifications}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
            <Notifications onClose={toggleNotifications} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
