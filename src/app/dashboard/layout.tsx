import React from 'react'
import Header from "../components/Header"
import Footer from '../components/Footer';
import Sidebar from '../components/userSidebar';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar/>
        <main className="flex-1 p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;