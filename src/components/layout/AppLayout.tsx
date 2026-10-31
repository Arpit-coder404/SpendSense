import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#111713] text-[#F7F5EF] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main
          className="flex-1 overflow-y-auto pb-20 md:pb-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(56,201,138,0.2) transparent' }}
        >
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;

