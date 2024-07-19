import React from 'react';
import Link from 'next/link';
import { FaUser, FaClipboardList } from 'react-icons/fa';

const Adminsidebar: React.FC = () => {
  return (
    <aside className="w-[15rem] fixed left-0 h-[calc(100vh)] mt-[64px] bg-white border-r-2 shadow-lg border-gray-400 text-black flex-shrink-0">
      <nav className="flex flex-col ">
        <Link href="/adminDashboard/users" className="py-4 px-4 flex users-name items-center hover:bg-black hover:colour-white rounded text-xl font-bold">
          <FaUser className="mr-2" /> Users
        </Link>
        <Link href="/adminDashboard/leaves" className="py-4 px-4  flex items-center users-name
         hover:bg-black  rounded text-lg font-bold ">
          <FaClipboardList className="mr-2" /> Requests
        </Link>
      </nav>
    </aside>
  );
};

export default Adminsidebar;
