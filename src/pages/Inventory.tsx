import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { PlusIcon, FilterIcon, SearchIcon } from 'lucide-react';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { InventoryForm } from '../components/inventory/InventoryForm';
export const Inventory = () => {
  const {
    items,
    categories
  } = useInventory();
  const [showForm, setShowForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });
  const filteredItems = items.filter(item => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return item.name.toLowerCase().includes(searchTerm) || item.category.toLowerCase().includes(searchTerm) || item.subCategory.toLowerCase().includes(searchTerm) || item.location.toLowerCase().includes(searchTerm);
    }
    return true;
  });
  const handleEdit = (id: string) => {
    setEditingItemId(id);
    setShowForm(true);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Delete implementation from context
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Inventory Management
        </h1>
        <button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-[#91c72d] text-white rounded-lg hover:bg-[#7caa28b2]">
          <PlusIcon size={20} className="mr-2" />
          Add Item
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select value={filters.category} onChange={e => setFilters({
            ...filters,
            category: e.target.value
          })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">All Categories</option>
              {categories.map(category => <option key={category.id} value={category.name}>
                  {category.name}
                </option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select value={filters.status} onChange={e => setFilters({
            ...filters,
            status: e.target.value
          })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="Active - Currently Used">
                Active - Currently Used
              </option>
              <option value="Active - Not Currently Used">
                Active - Not Currently Used
              </option>
              <option value="Inactive - Defective">Inactive - Defective</option>
              <option value="Disposed">Disposed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={16} className="text-gray-400" />
              </div>
              <input type="text" value={filters.search} onChange={e => setFilters({
              ...filters,
              search: e.target.value
            })} className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Search items..." />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(category => <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50" onClick={() => setFilters({
        ...filters,
        category: category.name
      })}>
            <h3 className="font-medium text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {items.filter(item => item.category === category.name).length}{' '}
              items
            </p>
            <div className="mt-2">
              {category.subCategories.map(sub => <span key={sub} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mr-2 mb-2">
                  {sub}
                </span>)}
            </div>
          </div>)}
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <InventoryTable items={filteredItems} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      {showForm && <InventoryForm itemId={editingItemId} onClose={() => {
      setShowForm(false);
      setEditingItemId(null);
    }} />}
    </div>;
};