import React from 'react';
import { BellIcon, UserIcon } from 'lucide-react';
export const Header = () => {
  return <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Welcome, Admin</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <BellIcon size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <UserIcon size={20} />
          </button>
        </div>
      </div>
    </header>;
};