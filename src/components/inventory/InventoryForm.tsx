import React, { useEffect, useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { XIcon } from 'lucide-react';
import { InventoryItem } from '../../types';
interface InventoryFormProps {
  itemId: string | null;
  onClose: () => void;
}
export const InventoryForm: React.FC<InventoryFormProps> = ({
  itemId,
  onClose
}) => {
  const {
    categories,
    locations,
    addItem,
    updateItem,
    getItemById
  } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    location: '',
    purchaseDate: '',
    supplier: '',
    cost: '',
    status: 'Active - Currently Used',
    remarks: ''
  });
  useEffect(() => {
    if (itemId) {
      const item = getItemById(itemId);
      if (item) {
        setFormData({
          name: item.name,
          category: item.category,
          subCategory: item.subCategory,
          location: item.location,
          purchaseDate: item.purchaseDate,
          supplier: item.supplier,
          cost: item.cost.toString(),
          status: item.status,
          remarks: item.remarks || ''
        });
        setSelectedCategory(item.category);
      }
    }
  }, [itemId, getItemById]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      ...formData,
      cost: parseFloat(formData.cost)
    };
    if (itemId) {
      updateItem(itemId, itemData);
    } else {
      addItem({
        ...itemData,
        usageHistory: []
      } as Omit<InventoryItem, 'id' | 'createdAt' | 'lastUpdated' | 'createdBy' | 'lastUpdatedBy'>);
    }
    onClose();
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      category,
      subCategory: '' // Reset subcategory when category changes
    }));
  };
  return <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {itemId ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input type="text" required value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select required value={formData.category} onChange={handleCategoryChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select Category</option>
                {categories.map(category => <option key={category.id} value={category.name}>
                    {category.name}
                  </option>)}
              </select>
            </div>
            {/* Sub-Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Category
              </label>
              <select required value={formData.subCategory} onChange={e => setFormData({
              ...formData,
              subCategory: e.target.value
            })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" disabled={!selectedCategory}>
                <option value="">Select Sub-Category</option>
                {selectedCategory && categories.find(cat => cat.name === selectedCategory)?.subCategories.map(sub => <option key={sub} value={sub}>
                        {sub}
                      </option>)}
              </select>
            </div>
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select required value={formData.location} onChange={e => setFormData({
              ...formData,
              location: e.target.value
            })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">Select Location</option>
                {locations.map(location => <option key={location.id} value={location.name}>
                    {location.name}
                  </option>)}
              </select>
            </div>
            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date
              </label>
              <input type="date" required value={formData.purchaseDate} onChange={e => setFormData({
              ...formData,
              purchaseDate: e.target.value
            })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input type="text" required value={formData.supplier} onChange={e => setFormData({
              ...formData,
              supplier: e.target.value
            })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost
              </label>
              <input type="number" required min="0" step="0.01" value={formData.cost} onChange={e => setFormData({
              ...formData,
              cost: e.target.value
            })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select required value={formData.status} onChange={e => setFormData({
              ...formData,
              status: e.target.value as InventoryItem['status']
            })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="Active - Currently Used">
                  Active - Currently Used
                </option>
                <option value="Active - Not Currently Used">
                  Active - Not Currently Used
                </option>
                <option value="Inactive - Defective">
                  Inactive - Defective
                </option>
                <option value="Disposed">Disposed</option>
              </select>
            </div>
          </div>
          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea value={formData.remarks} onChange={e => setFormData({
            ...formData,
            remarks: e.target.value
          })} rows={3} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#91c72d] text-white rounded-md hover:bg-[#7caa28b2]">
              {itemId ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};