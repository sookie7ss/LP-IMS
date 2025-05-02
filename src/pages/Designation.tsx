import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { MapPinIcon, SearchIcon, BoxIcon } from "lucide-react";

export const Designation = () => {
  const { items, locations } = useInventory();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Helper functions to safely access properties
  const getItemName = (item: any) => item.itemName || item.item_name || "";
  const getItemCategory = (item: any) =>
    item.itemCategory || item.item_category || "";
  const getItemSubCategory = (item: any) =>
    item.itemSubCategory || item.item_sub_category || "";
  const getItemLocation = (item: any) => item.item_location || "";
  const getItemStatus = (item: any) => item.status || "";
  const getItemUsageHistory = (item: any) => item.usage_history || [];
  const getItemLastUpdated = (item: any) =>
    item.lastUpdated || item.last_update || new Date().toISOString();

  const filteredItems = items.filter((item) => {
    const matchesSearch = search
      ? getItemName(item).toLowerCase().includes(search.toLowerCase()) ||
        getItemCategory(item).toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesLocation = selectedLocation
      ? getItemLocation(item) === selectedLocation
      : true;
    return matchesSearch && matchesLocation;
  });

  const locationStats = locations.map((location) => {
    const locationItems = items.filter(
      (item) => getItemLocation(item) === location.location_name
    );
    return {
      ...location,
      totalItems: locationItems.length,
      activeItems: locationItems.filter(
        (item) =>
          getItemStatus(item) === "Active - Currently Used" ||
          getItemStatus(item) === "Active - Not Currently Used"
      ).length,
      inactiveItems: locationItems.filter(
        (item) =>
          getItemStatus(item) === "Inactive - Defective" ||
          getItemStatus(item) === "Disposed"
      ).length,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Location Assignments
        </h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <SearchIcon
            className="absolute left-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {locationStats.map((location) => (
          <div
            key={location.location_id}
            onClick={() => setSelectedLocation(location.location_name)}
            className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all
              ${
                selectedLocation === location.location_name
                  ? "ring-2 ring-blue-500"
                  : "hover:bg-gray-50"
              }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{location.location_name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {location.totalItems} items
                </p>
              </div>
              <MapPinIcon className="text-gray-400" size={20} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 bg-green-50 rounded-md">
                <span className="text-sm font-medium text-green-700">
                  {location.activeItems} Active
                </span>
              </div>
              <div className="p-2 bg-yellow-50 rounded-md">
                <span className="text-sm font-medium text-yellow-700">
                  {location.inactiveItems} Inactive
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {selectedLocation ? `Items in ${selectedLocation}` : "All Items"}
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div key={item.item_id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {getItemName(item)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {getItemCategory(item)} - {getItemSubCategory(item)}
                    </p>
                  </div>
                  <BoxIcon className="text-gray-400" size={20} />
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${getStatusColor(getItemStatus(item))}`}
                  >
                    {getItemStatus(item)}
                  </span>
                  {getItemUsageHistory(item).length > 0 &&
                    getItemUsageHistory(item)[0] &&
                    !getItemUsageHistory(item)[0].endDate && (
                      <p className="mt-2 text-sm text-gray-500">
                        Currently used by:{" "}
                        {getItemUsageHistory(item)[0].userName}
                      </p>
                    )}
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date(getItemLastUpdated(item)).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="py-8 text-center">
              <MapPinIcon className="mx-auto w-12 h-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No items found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {search
                  ? "Try adjusting your search terms"
                  : "Start by adding items to this location"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active - Currently Used":
      return "bg-green-100 text-green-800";
    case "Active - Not Currently Used":
      return "bg-blue-100 text-blue-800";
    case "Inactive - Defective":
      return "bg-yellow-100 text-yellow-800";
    case "Disposed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
