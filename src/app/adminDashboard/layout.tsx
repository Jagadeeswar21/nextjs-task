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
        <main className="flex-1 p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;