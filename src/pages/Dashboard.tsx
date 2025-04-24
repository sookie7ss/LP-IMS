import React from "react";
import { useInventory } from "../context/InventoryContext";
import {
  PackageIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";

// Define types for clarity
interface UsageHistory {
  userId: string;
  userName: string;
  startDate: string;
  endDate?: string;
}

export const Dashboard = () => {
  const { items } = useInventory();

  // Helper functions to handle property name inconsistencies
  const getItemName = (item: any) => item.itemName || item.item_name || "";
  const getItemStatus = (item: any) => item.status || "";
  const getUsageHistory = (item: any): UsageHistory[] =>
    item.usageHistory || [];
  const getLastUpdated = (item: any) =>
    item.lastUpdated || item.last_update || new Date().toISOString();

  const stats = {
    total: items.length,
    active: items.filter(
      (item) => getItemStatus(item) === "Active - Currently Used"
    ).length,
    inactive: items.filter(
      (item) => getItemStatus(item) === "Inactive - Defective"
    ).length,
    disposed: items.filter((item) => getItemStatus(item) === "Disposed").length,
  };

  const recentActivities = items
    .flatMap((item) => [
      ...getUsageHistory(item).map((history) => ({
        type: "usage",
        date: history.startDate,
        item,
        user: history.userName,
        action: "started using",
      })),
      {
        type: "update",
        date: getLastUpdated(item),
        item,
        user: "System",
        action: "updated",
      },
    ])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Items"
          value={stats.total.toString()}
          icon={PackageIcon}
          color="blue"
        />
        <DashboardCard
          title="Active Items"
          value={stats.active.toString()}
          icon={CheckCircleIcon}
          color="green"
        />
        <DashboardCard
          title="Inactive Items"
          value={stats.inactive.toString()}
          icon={AlertCircleIcon}
          color="yellow"
        />
        <DashboardCard
          title="Disposed Items"
          value={stats.disposed.toString()}
          icon={XCircleIcon}
          color="red"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === "usage" ? (
                      <UserIcon className="text-blue-500" size={20} />
                    ) : (
                      <ClockIcon className="text-gray-400" size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium">
                        {getItemName(activity.item)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon: Icon, color }: any) => (
  <div
    className={`flex items-center p-4 space-x-4 rounded-lg shadow-sm bg-${color}-100`}
  >
    <Icon className={`w-8 h-8 text-${color}-500`} />
    <div>
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);
