 import React, { useState } from 'react';
 import { useInventory } from '../context/InventoryContext';
import { CalendarIcon, FilterIcon, TrendingUpIcon, BuildingIcon } from 'lucide-react';
import { FaMoneyBillAlt } from 'react-icons/fa';

    export const PurchaseDetails = () => {
      const { items } = useInventory();
      const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
      });

      const filteredItems = items.filter(item => {
        const purchaseDate = new Date(item.purchaseDate);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        if (startDate && purchaseDate < startDate) return false;
        if (endDate && purchaseDate > endDate) return false;
        return true;
      }).sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

      const totalCost = filteredItems.reduce((sum, item) => sum + item.cost, 0);

      const supplierGroups = filteredItems.reduce((groups: Record<string, typeof items>, item) => {
        if (!groups[item.supplier]) {
          groups[item.supplier] = [];
        }
        groups[item.supplier].push(item);
        return groups;
      }, {});

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Purchase Details</h1>
            <div className="flex space-x-4">
              <div>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange(prev => ({
                    ...prev,
                    start: e.target.value
                  }))}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange(prev => ({
                    ...prev,
                    end: e.target.value
                  }))}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Purchases</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {filteredItems.length}
                  </p>
                </div>
                <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                  <CalendarIcon size={24} />
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="mt-1 text-2xl font-semibold">
                    ?{totalCost.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-full bg-green-50 p-3 text-green-600">
                  <FaMoneyBillAlt size={24} />
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Cost per Item</p>
                  <p className="mt-1 text-2xl font-semibold">
                    ?{(totalCost / (filteredItems.length || 1)).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-full bg-purple-50 p-3 text-purple-600">
                  <TrendingUpIcon size={24} />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow-sm">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium text-gray-900">
                Purchases by Supplier
              </h2>
            </div>
            <div className="p-4">
              {Object.entries(supplierGroups).map(([supplier, items]) => (
                <div key={supplier} className="mb-6 last:mb-0">
                  <div className="mb-4 flex items-center space-x-2">
                    <BuildingIcon className="text-gray-400" size={20} />
                    <h3 className="text-lg font-medium text-gray-900">
                      {supplier}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({items.length} items - ?
                      {items.reduce((sum, item) => sum + item.cost, 0).toFixed(2)})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map(item => (
                      <div key={item.id} className="rounded-lg bg-gray-50 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            ?{item.cost.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CalendarIcon size={16} className="mr-1" />
                          {new Date(item.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };