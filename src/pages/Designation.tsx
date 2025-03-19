import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { MapPinIcon, SearchIcon, BoxIcon } from 'lucide-react';
export const Designation = () => {
  const {
    items,
    locations
  } = useInventory();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const filteredItems = items.filter(item => {
    const matchesSearch = search ? item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()) : true;
    const matchesLocation = selectedLocation ? item.location === selectedLocation : true;
    return matchesSearch && matchesLocation;
  });
  const locationStats = locations.map(location => {
    const locationItems = items.filter(item => item.location === location.name);
    return {
      ...location,
      totalItems: locationItems.length,
      activeItems: locationItems.filter(item => item.status === 'Active - Currently Used' || item.status === 'Active - Not Currently Used').length,
      inactiveItems: locationItems.filter(item => item.status === 'Inactive - Defective' || item.status === 'Disposed').length
    };
  });
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Location Assignments
        </h1>
        <div className="relative w-64">
          <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
          <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {locationStats.map(location => <div key={location.id} onClick={() => setSelectedLocation(location.name)} className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all
              ${selectedLocation === location.name ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {location.totalItems} items
                </p>
              </div>
              <MapPinIcon className="text-gray-400" size={20} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-green-50 rounded-md p-2">
                <span className="text-sm font-medium text-green-700">
                  {location.activeItems} Active
                </span>
              </div>
              <div className="bg-yellow-50 rounded-md p-2">
                <span className="text-sm font-medium text-yellow-700">
                  {location.inactiveItems} Inactive
                </span>
              </div>
            </div>
          </div>)}
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {selectedLocation ? `Items in ${selectedLocation}` : 'All Items'}
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.category} - {item.subCategory}
                    </p>
                  </div>
                  <BoxIcon className="text-gray-400" size={20} />
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  {item.usageHistory.length > 0 && !item.usageHistory[0].endDate && <p className="text-sm text-gray-500 mt-2">
                        Currently used by: {item.usageHistory[0].userName}
                      </p>}
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  Last updated:{' '}
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </div>
              </div>)}
          </div>
          {filteredItems.length === 0 && <div className="text-center py-8">
              <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No items found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {search ? 'Try adjusting your search terms' : 'Start by adding items to this location'}
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active - Currently Used':
      return 'bg-green-100 text-green-800';
    case 'Active - Not Currently Used':
      return 'bg-blue-100 text-blue-800';
    case 'Inactive - Defective':
      return 'bg-yellow-100 text-yellow-800';
    case 'Disposed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};