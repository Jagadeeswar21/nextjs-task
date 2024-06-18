'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession,signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logout successful!",{
        position:"bottom-right"
      });
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };
  return (
    <header className="bg-blue-600 text-white flex items-center justify-between p-3">
        <h1 className="text-2xl "> Dashboard</h1>
      {session && (
        <div className="flex items-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white ml-auto px-3 py-2 rounded">
          Logout
        </button>
        </div>
      )}
    </header>
  );
};
export default Header;