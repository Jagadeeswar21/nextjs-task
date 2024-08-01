'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaClipboardList } from 'react-icons/fa';

const Managersidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/manager/users', icon: FaUser, label: 'Users' },
    { href: '/manager/leaves', icon: FaClipboardList, label: 'Requests' },
  ];

  return (
    <aside className="w-[6rem] fixed left-0 h-[calc(100vh)] mt-[64px] bg-white border-r-2 shadow-xl text-black flex-shrink-0">
      <nav className="flex flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`py-3 px-3 flex flex-col items-center rounded text-lg text-sm ${
              pathname === link.href
                ? 'bg-black text-white'
                : 'hover:bg-black hover:text-white'
            }`}
          >
            <link.icon className="mb-2 text-xl" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Managersidebar;