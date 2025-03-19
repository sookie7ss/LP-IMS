import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
export const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>;
};