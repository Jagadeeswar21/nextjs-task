import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[10rem] fixed left-0 h-[calc(100vh-128px)] mt-[64px] bg-gray-700 text-white flex-shrink-0">
      <nav className="flex flex-col p-4">
        <Link href="/dashboard/homePage"
           className="py-2 px-4 hover:bg-gray-700 rounded">Home
        </Link>
        <Link href="/dashboard/contacts"
           className="py-2 px-4 hover:bg-gray-700 rounded">Contacts
        </Link>
        <Link href="/dashboard/leaves"
           className="py-2 px-4 hover:bg-gray-700 rounded">Leave
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;