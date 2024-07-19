
import React from 'react';
import Link from 'next/link';
import { FaUser, FaClipboardList } from 'react-icons/fa';

const Adminsidebar: React.FC = () => {
  return (
    <aside className="w-[10rem] fixed left-0 h-[calc(100vh)] mt-[64px] bg-white border-r-2 shadow-lg border-gray-400 text-black flex-shrink-0">
      <nav className="flex flex-col">
      <Link href="/adminDashboard/dashboard"
           className="py-2 px-4 hover:bg-gray-700 rounded">Dashboard
        </Link>
        <Link href="/adminDashboard/users" className="py-4 px-4 flex flex-col items-center hover:bg-black hover:text-white rounded text-xl font-bold">
          <FaUser className="mb-2" />
          <span>Users</span>
        </Link>
        <Link href="/adminDashboard/leaves" className="py-4 px-4 flex flex-col items-center hover:bg-black hover:text-white rounded text-lg font-bold">
          <FaClipboardList className="mb-2" />
          <span>Requests</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Adminsidebar;
