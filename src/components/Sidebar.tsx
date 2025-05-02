import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, PackageIcon, MapPinIcon, ShoppingCartIcon, HistoryIcon, UsersIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/head.png';

export const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { path: '/Dashboard', icon: LayoutDashboardIcon, label: 'Dashboard' },
    { path: '/inventory', icon: PackageIcon, label: 'Inventory' },
    { path: '/designation', icon: MapPinIcon, label: 'Designation' },
    { path: '/purchase-details', icon: ShoppingCartIcon, label: 'Purchase Details' },
    { path: '/usage-history', icon: HistoryIcon, label: 'Usage History' },
    { path: '/user-management', icon: UsersIcon, label: 'User Management' }
  ];

  return (
    <aside
  className={`bg-black/80 border-r border-gray-200 transition-all duration-300 shadow-lg ${
    isExpanded ? 'w-64' : 'w-25'
  }`}
  onMouseEnter={() => setIsExpanded(true)}
  onMouseLeave={() => setIsExpanded(false)}
>
<Link
  to="/Dashboard"
  className="flex items-center border-b border-gray-300 bg-[#91c72d] p-4"
>
  <motion.img
    src={logo}
    alt="Logo"
    className={`h-12 w-12 rounded-lg border border-gray-300 shadow-lg transition-all duration-300 ${
      isExpanded ? '' : 'mx-auto'
    }`}
    animate={{ rotate: 900 }}
    transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
  />
  {isExpanded && (
    <motion.h1
      className="ml-5 text-xl font-bold text-[#b5fa35]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      Launchpad Inventory
    </motion.h1>
  )}
</Link>

  <nav className="mt-2 space-y-4">
    {navItems.map(({ path, icon: Icon, label }) => {
      const isActive = location.pathname === path;
      return (
        <Link
          key={path}
          to={path}
          className={`flex items-center transition-all duration-200 text-white hover:bg-[#91c72d] ${
            isExpanded ? 'px-5 py-3 space-x-3' : 'justify-center p-3'
          } ${isActive ? 'bg-[#91c72d]' : ''}`}
        >
          <Icon size={24} />
          {isExpanded && (
            <motion.span
              className="text-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {label}
            </motion.span>
          )}
        </Link>
      );
    })}
  </nav>
</aside>
  );
};
