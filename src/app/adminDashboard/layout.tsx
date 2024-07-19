import React from 'react'
import Header from "../components/Header"
import Footer from '../components/Footer';
import Adminsidebar from '../components/adminSidebar';


const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Adminsidebar/>
        <main className="flex-1 bg-[#F3F4F7] p-4 ml-[10rem] mt-[64px] h-[calc(100vh)] overflow-y-auto w-[calc(100%-10rem)]">{children}</main>
        
      </div>
      
    </div>
  );
};

export default AdminLayout;