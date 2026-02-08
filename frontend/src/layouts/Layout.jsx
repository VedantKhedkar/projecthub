import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFAB from '../components/WhatsAppFAB';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };

  return (
    /* Added overflow-x-hidden here to prevent the horizontal scrollbar */
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden relative">
      <div 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        className="fixed z-50 h-full"
      >
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div 
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 max-w-full overflow-x-hidden ${
          isOpen ? "md:ml-[260px]" : "md:ml-[80px]"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>

        <Footer />
        <WhatsAppFAB />
      </div>
    </div>
  );
};

export default Layout;