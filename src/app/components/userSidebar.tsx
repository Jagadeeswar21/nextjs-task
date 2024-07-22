import React from 'react';
import Link from 'next/link';
import { FaHome,FaClipboardList } from 'react-icons/fa';
import { RiContactsBook3Fill } from "react-icons/ri";
const Sidebar: React.FC = () => {
  return (
    <aside  className="w-[6rem] fixed left-0 h-[calc(100vh)] mt-[64px] bg-white border-r-2 shadow-xl text-black flex-shrink-0">
      <nav className="flex flex-col">
        <Link href="/dashboard/homePage" className="py-3 px-3 flex flex-col items-center hover:bg-black hover:text-white rounded text-lg text-sm">
        <FaHome className="mb-2 text-xl"/>
        <span>Home</span>
        </Link>
        <Link href="/dashboard/contacts" className="py-3 px-3 flex flex-col items-center hover:bg-black hover:text-white rounded text-lg text-sm">
        <RiContactsBook3Fill className="mb-2 text-xl"/>
        <span>Contacts</span>
        </Link>
        <Link href="/dashboard/leaves"
           className="py-3 px-3 flex flex-col items-center hover:bg-black hover:text-white rounded text-lg text-sm">
           <FaClipboardList className="mb-2 text-xl" />
           <span>Leaves</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;