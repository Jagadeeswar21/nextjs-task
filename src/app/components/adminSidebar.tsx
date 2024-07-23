
import React from 'react';
import Link from 'next/link';
import { FaUser, FaClipboardList } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";
const Adminsidebar: React.FC = () => {
  return (
    <aside className="w-[6rem] fixed left-0 h-[calc(100vh)] mt-[64px] bg-white border-r-2 shadow-xl text-black flex-shrink-0">
      <nav className="flex flex-col ">
        <Link href="/adminDashboard/dashboard" className="py-3 px-3 flex flex-col items-center hover:bg-black hover:text-white rounded text-lg text-sm">
          <MdDashboard className="mb-2 text-xl" />
          <span>Dashboard</span>
        </Link>
        <Link href="/adminDashboard/users" className="py-3 px-3 flex flex-col items-center hover:bg-black hover:text-white rounded text-lg text-sm">
          <FaUser className="mb-2 text-xl" />
          <span>Users</span>
        </Link>
        <Link href="/adminDashboard/leaves" className="py-3 px-3 flex flex-col items-center hover:bg-black hover:text-white rounded text-lg text-sm">
          <FaClipboardList className="mb-2 text-xl" />
          <span>Requests</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Adminsidebar;
