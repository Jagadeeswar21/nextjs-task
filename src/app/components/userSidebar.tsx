'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaClipboardList, FaBook,FaShoppingCart } from 'react-icons/fa';
import { RiContactsBook3Fill } from "react-icons/ri";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard/homePage', icon: FaHome, label: 'Home' },
    { href: '/dashboard/contacts', icon: RiContactsBook3Fill, label: 'Contacts' },
    { href: '/dashboard/leaves', icon: FaClipboardList, label: 'Leaves' },
    { href: '/dashboard/books', icon: FaBook, label: 'Books' },
    { href: '/dashboard/orders', icon: FaShoppingCart, label: 'Orders' },
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

export default Sidebar;