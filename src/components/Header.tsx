import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, UserIcon } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear session
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="bg-white border-b border-gray-200 h-20 relative">
      <div className="h-full px-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Welcome, Admin</h2>
        <div className="flex items-center space-x-4">

          {/* Notification Bell Dropdown */}
          <Menu as="div" className="relative">
  <Menu.Button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
    <BellIcon size={20} />
  </Menu.Button>

  <Transition
    enter="transition ease-out duration-100"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
  >
    <Menu.Items className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200 z-10">
      <div className="py-2 px-4 border-b text-sm font-semibold text-gray-700">
        Notifications
      </div>

      {/* Default notifications */}
      <Menu.Item>
        {() => (
          <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
            🔔 Inventory low on item X
          </div>
        )}
      </Menu.Item>
      <Menu.Item>
        {() => (
          <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
            ❌ item #12345 has inactive
          </div>
        )}
      </Menu.Item>
      <Menu.Item>
        {() => (
          <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
            📦 New item added to inventory
          </div>
        )}
      </Menu.Item>

      {/* Expanded notifications */}
      {showAllNotifications && (
        <>
          <Menu.Item>
            {() => (
              <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                🔁 Item #999 restocked
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {() => (
              <div className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                ⚠️ Expiry alert for item #302
              </div>
            )}
          </Menu.Item>
        </>
      )}

      {/* Toggle link */}
      <div
        className="text-center border-t text-sm text-blue-500 hover:underline py-2 cursor-pointer"
        onClick={() => setShowAllNotifications(!showAllNotifications)}
      >
        {showAllNotifications ? 'Show Less' : 'View All'}
      </div>
    </Menu.Items>
  </Transition>
</Menu>


          {/* User Icon Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <UserIcon size={24} />
            </Menu.Button>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200">

                {/* Logout Button */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? 'bg-[#adeb36] text-red-500' : 'text-red-500'
                      }`}
                      onClick={() => setIsPopoverOpen(true)}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Centered Logout Popover */}
      {isPopoverOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-80 bg-white shadow-lg rounded-md border border-gray-200 p-6">
            <p className="text-sm text-gray-800 text-center">Are you sure you want to log out?</p>
            <div className="flex justify-center mt-4 space-x-2">
              <button
                className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-[#adeb36]"
                onClick={() => setIsPopoverOpen(false)}
              >
                Cancel
              </button>
              <Link
                to="/"
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
