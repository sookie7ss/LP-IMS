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
    { path: '/purchase-details', icon: ShoppingCartIcon, label: 'Purchase Details ' },
    { path: '/usage-history', icon: HistoryIcon, label: 'Usage History ' },
    { path: '/user-management', icon: UsersIcon, label: 'User Management' }
  ];

  return (
    <aside
      className={`bg-black/80 border-r border-gray-200 transition-all duration-300 shadow-lg  ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center justify-center border-b border-gray-300 bg-[#91c72d] p-4">
        <motion.img 
          src={logo} 
          alt="Logo" 
          className="h-12 w-12 ml-8 rounded-lg border border-gray-300 shadow-lg"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        />
        <motion.h1 
          className="ml-3 text-xl font-bold text-[rgb(244,247,135)]"
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? 'Launchpad Inventory' : 'LP'}
        </motion.h1>
      </div>
      <nav className="p-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-3 rounded-lg transition-all duration-200 text-white hover:bg-[#91c72d] ${isExpanded ? 'px-1 py-4' : 'px-1 py-3'}`}
          >
            <Icon size={24} className="ml-3 min-w-max" />
            <motion.span 
              className="text-lg"
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {label}
            </motion.span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
