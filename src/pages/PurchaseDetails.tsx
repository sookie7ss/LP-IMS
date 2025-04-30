import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import {
  CalendarIcon,
  FilterIcon,
  TrendingUpIcon,
  BuildingIcon,
} from "lucide-react";
import { FaMoneyBillAlt } from "react-icons/fa";

export const PurchaseDetails = () => {
  const { items } = useInventory();
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Helper functions to safely access properties
  const getItemName = (item: any) =>
    item.itemName || item.item_name || item.name || "";
  const getItemCategory = (item: any) =>
    item.itemCategory || item.item_category || item.category || "";
  const getItemSupplier = (item: any) => item.supplier || "";
  const getItemPurchaseDate = (item: any) => item.purchaseDate || "";
  const getItemCost = (item: any): number => {
    const cost = item.cost || 0;
    return typeof cost === "string" ? parseFloat(cost) : cost;
  };

  const filteredItems = items
    .filter((item) => {
      const purchaseDate = new Date(getItemPurchaseDate(item));
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      if (!getItemPurchaseDate(item)) return false; // Skip items without purchase date
      if (startDate && purchaseDate < startDate) return false;
      if (endDate && purchaseDate > endDate) return false;

      return true;
    })
    .sort(
      (a, b) =>
        new Date(getItemPurchaseDate(b)).getTime() -
        new Date(getItemPurchaseDate(a)).getTime()
    );

  const totalCost = filteredItems.reduce(
    (sum, item) => sum + getItemCost(item),
    0
  );

  const supplierGroups = filteredItems.reduce(
    (groups: Record<string, typeof items>, item) => {
      const supplier = getItemSupplier(item);
      if (!groups[supplier]) {
        groups[supplier] = [];
      }
      groups[supplier].push(item);
      return groups;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Purchase Details</h1>
        <div className="flex space-x-4">
          <div>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  start: e.target.value,
                }))
              }
              className="px-3 py-2 rounded-md border border-gray-300"
            />
          </div>
          <div>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  end: e.target.value,
                }))
              }
              className="px-3 py-2 rounded-md border border-gray-300"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Purchases</p>
              <p className="mt-1 text-2xl font-semibold">
                {filteredItems.length}
              </p>
            </div>
            <div className="p-3 text-blue-600 bg-blue-50 rounded-full">
              <CalendarIcon size={24} />
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="mt-1 text-2xl font-semibold">
                &#8369;{totalCost.toFixed(2)}
              </p>
            </div>
            <div className="p-3 text-green-600 bg-green-50 rounded-full">
              <FaMoneyBillAlt size={24} />
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Avg. Cost per Item</p>
              <p className="mt-1 text-2xl font-semibold">
                &#8369;{(totalCost / (filteredItems.length || 1)).toFixed(2)}
              </p>
            </div>
            <div className="p-3 text-purple-600 bg-purple-50 rounded-full">
              <TrendingUpIcon size={24} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Purchases by Supplier
          </h2>
        </div>
        <div className="p-4">
          {Object.entries(supplierGroups).map(([supplier, items]) => (
            <div key={supplier} className="mb-6 last:mb-0">
              <div className="flex items-center mb-4 space-x-2">
                <BuildingIcon className="text-gray-400" size={20} />
                <h3 className="text-lg font-medium text-gray-900">
                  {supplier || "Unknown Supplier"}
                </h3>
                <span className="text-sm text-gray-500">
                  ({items.length} items - &#8369;
                  {items
                    .reduce((sum, item) => sum + getItemCost(item), 0)
                    .toFixed(2)}
                  )
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {getItemName(item)}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {getItemCategory(item)}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        &#8369;{getItemCost(item).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <CalendarIcon size={16} className="mr-1" />
                      {new Date(getItemPurchaseDate(item)).toLocaleDateString()}
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
