import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import backgroundImage from '../assets/background.jpg'; // Import your background image

export const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative flex h-screen">
      {/* Background Image with Blur Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Overlay Content (Ensures Readability) */}
      <div className="relative flex h-screen w-full bg-white bg-opacity-70">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </div>
  );
};
