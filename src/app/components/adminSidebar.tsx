'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaClipboardList } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";

const Adminsidebar: React.FC = () => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(pathname || '');
  }, [pathname]);

  const links = [
    { href: "/adminDashboard/dashboard", icon: MdDashboard, label: "Dashboard" },
    { href: "/adminDashboard/users", icon: FaUser, label: "Users" },
    { href: "/adminDashboard/leaves", icon: FaClipboardList, label: "Requests" },
  ];

  return (
    <aside className="w-[6rem] fixed left-0 h-[calc(100vh)] mt-[64px] bg-white border-r-2 shadow-xl text-black flex-shrink-0">
      <nav className="flex flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`py-3 px-3 flex flex-col items-center rounded text-lg text-sm ${
              activeLink === link.href ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
            }`} 
            onClick={() => setActiveLink(link.href)}
          >
            <link.icon className="mb-2 text-xl" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Adminsidebar;