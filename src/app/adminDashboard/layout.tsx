import React from 'react'
import Header from "../components/Header"
import Adminsidebar from '../components/adminSidebar';


const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Adminsidebar/>
        <main className="flex-1 bg-[#F3F4F7] p-4 ml-[6rem] mt-[64px]    h-[calc(100vh-30px)] overflow-y-auto w-[calc(100%-6rem)]">{children}</main>
      </div>
      
    </div>
  );
};

export default AdminLayout;