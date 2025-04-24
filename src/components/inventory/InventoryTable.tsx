import React from "react";
import { InventoryItem } from "../../types";
import { Edit2Icon, Trash2Icon } from "lucide-react";
interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  // Function to safely get item properties regardless of naming convention
  const getItemName = (item: any) => item.itemName || item.item_name || "";
  const getItemCategory = (item: any) =>
    item.itemCategory || item.item_category || "";
  const getItemSubCategory = (item: any) =>
    item.itemSubCategory || item.item_sub_category || "";
  const getItemId = (item: any): string => (item.id || "").toString();
  const getLastUpdated = (item: any) =>
    item.lastUpdated || item.last_update || new Date().toISOString();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Location
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Last Updated
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-6 text-sm text-center text-gray-500"
              >
                No inventory items found.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={getItemId(item)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getItemName(item)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getItemSubCategory(item)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {getItemCategory(item)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {item.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(getLastUpdated(item)).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <button
                    aria-label={`Edit ${getItemName(item)}`}
                    onClick={() => onEdit(getItemId(item))}
                    className="mr-3 text-blue-600 hover:text-blue-900"
                  >
                    <Edit2Icon size={16} />
                  </button>
                  <button
                    aria-label={`Delete ${getItemName(item)}`}
                    onClick={() => onDelete(getItemId(item))}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2Icon size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const getStatusColor = (status: string) => {
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case "active - currently used":
      return "bg-green-100 text-green-800";
    case "active - not currently used":
      return "bg-blue-100 text-blue-800";
    case "inactive - defective":
      return "bg-yellow-100 text-yellow-800";
    case "disposed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
