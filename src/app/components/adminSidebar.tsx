import React from 'react'
import Link from 'next/link'

const Adminsidebar: React.FC = () => {
  return (
    <aside className="w-[10rem] fixed left-0 h-[calc(100vh-128px)] mt-[64px] bg-gray-700 text-white flex-shrink-0">
      <nav className="flex flex-col p-4">
        <Link href="/adminDashboard/users"
           className="py-2 px-4 hover:bg-gray-700 rounded">Users
        </Link>
        <Link href="/adminDashboard/leaves"
           className="py-2 px-4 hover:bg-gray-700 rounded">Requests
        </Link>
      </nav>
    </aside>
  );
};

export default Adminsidebar