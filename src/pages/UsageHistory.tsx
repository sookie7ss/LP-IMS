import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useUser } from '../context/UserContext';
import { ClockIcon, UserIcon, SearchIcon, CalendarIcon, TimerIcon } from 'lucide-react';
export const UsageHistory = () => {
  const {
    items
  } = useInventory();
  const {
    users
  } = useUser();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const usageEntries = items.flatMap(item => item.usageHistory.map(history => ({
    itemId: item.id,
    itemName: item.name,
    category: item.category,
    location: item.location,
    status: item.status,
    userId: history.userId,
    userName: history.userName,
    startDate: history.startDate,
    endDate: history.endDate
  }))).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const filteredEntries = usageEntries.filter(entry => {
    if (selectedUser && entry.userId !== selectedUser) return false;
    if (search) {
      const searchTerm = search.toLowerCase();
      return entry.itemName.toLowerCase().includes(searchTerm) || entry.userName.toLowerCase().includes(searchTerm);
    }
    return true;
  });
  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Usage History</h1>
        <div className="flex space-x-4">
          <div className="relative w-64">
            <input type="text" placeholder="Search items or users..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
            <option value="">All Users</option>
            {users.map(user => <option key={user.id} value={user.id}>
                {user.name}
              </option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Currently In Use</p>
              <p className="text-2xl font-semibold mt-1">
                {usageEntries.filter(entry => !entry.endDate).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full text-green-600">
              <TimerIcon size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usage Records</p>
              <p className="text-2xl font-semibold mt-1">
                {usageEntries.length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <ClockIcon size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold mt-1">
                {new Set(usageEntries.filter(entry => !entry.endDate).map(entry => entry.userId)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full text-purple-600">
              <UserIcon size={24} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Usage Timeline</h2>
        </div>
        <div className="p-4">
          {filteredEntries.map((entry, index) => {
          const duration = calculateDuration(entry.startDate, entry.endDate);
          return <div key={`${entry.itemId}-${index}`} className="mb-6 last:mb-0">
                <div className="relative flex items-center mb-2">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <UserIcon className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {entry.userName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {duration} days {!entry.endDate && '(ongoing)'}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-sm font-medium text-gray-900">
                        {entry.itemName}
                      </span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {entry.category}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <CalendarIcon size={16} className="mr-1" />
                      {new Date(entry.startDate).toLocaleDateString()}
                      {entry.endDate && <>
                          <span className="mx-2">→</span>
                          {new Date(entry.endDate).toLocaleDateString()}
                        </>}
                    </div>
                  </div>
                </div>
              </div>;
        })}
        </div>
      </div>
    </div>;
};