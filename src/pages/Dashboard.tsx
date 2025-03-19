import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
    PackageIcon,
    AlertCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    UserIcon,
    CalendarIcon
} from 'lucide-react';

export const Dashboard = () => {
  const {
    items
  } = useInventory();
  const stats = {
    total: items.length,
    active: items.filter(item => item.status === 'Active - Currently Used').length,
    inactive: items.filter(item => item.status === 'Inactive - Defective').length,
    disposed: items.filter(item => item.status === 'Disposed').length
  };
  const recentActivities = items.flatMap(item => [...item.usageHistory.map(history => ({
    type: 'usage',
    date: history.startDate,
    item,
    user: history.userName,
    action: 'started using'
  })), {
    type: 'update',
    date: item.lastUpdated,
    item,
    user: 'System',
    action: 'updated'
  }]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  return <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Items" value={stats.total.toString()} icon={PackageIcon} color="blue" />
        <DashboardCard title="Active Items" value={stats.active.toString()} icon={CheckCircleIcon} color="green" />
        <DashboardCard title="Inactive Items" value={stats.inactive.toString()} icon={AlertCircleIcon} color="yellow" />
        <DashboardCard title="Disposed Items" value={stats.disposed.toString()} icon={XCircleIcon} color="red" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'usage' ? <UserIcon className="text-blue-500" size={20} /> : <ClockIcon className="text-gray-400" size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium">{activity.item.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleString()}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Inventory Status</h3>
          <div className="space-y-4">
            {Object.entries(items.reduce((acc: Record<string, number>, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {})).map(([category, count]) => <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <PackageIcon size={16} className="mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {category}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{count} items</span>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  };
  return <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>;
};