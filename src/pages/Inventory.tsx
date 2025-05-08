import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/createclient";
import { PlusIcon, SearchIcon } from "lucide-react";
import { InventoryTable } from "../components/inventory/InventoryTable";
import { InventoryForm } from "../components/inventory/InventoryForm";
import { getItems } from "../lib/supabase/items";
import { Category, Sub_Category } from "../interface/interfaceCategories";

export const Inventory = () => {
  const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
      const fetchItems = async () => {
        const data = await getItems();
        setItems(data);
      }
      fetchItems();
    }, []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Sub_Category[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("Category").select(`
      category_id,
      category_name,
      Sub_Category (
        sub_category_id,
        sub_category_name
      )
    `);
    if (error) {
      console.error("Error fetching categories:", error);
    } else if (data) {
      setCategories(data);
    }
  };

  const fetchSubCategories = async (categoryId: number) => {
    const { data, error } = await supabase
      .from("SubCategory")
      .select(
        `
      sub_category_id,
      sub_category_name
    `
      )
      .eq("category_id", categoryId);

    if (error) {
      console.error("Error fetching subcategories:", error);
    } else if (data) {
      setSubCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (categories.length > 0) {
      fetchSubCategories(categories[0].category_id);
    }
  }, []);
    
  const [showForm, setShowForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });
  const filteredItems = items.filter((item) => {
    if (filters.category && item.item_category !== filters.category)
      return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        item.item_name.toLowerCase().includes(searchTerm) ||
        item.item_category.toLowerCase().includes(searchTerm) ||
        item.item_sub_category.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
  const handleEdit = (id: string) => {
    setEditingItemId(id);
    setShowForm(true);
  };
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Delete implementation from context
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Inventory Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-[#91c72d] text-white rounded-lg hover:bg-[#7caa28b2]"
        >
          <PlusIcon size={20} className="mr-2" />
          Add Item
        </button>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value,
                })
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option
                  key={category.category_id}
                  value={category.category_name}
                >
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value,
                })
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
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
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <SearchIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    search: e.target.value,
                  })
                }
                className="block pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Search items..."
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.category_id}
            className="p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() =>
              setFilters({
                ...filters,
                category: category.category_name,
              })
            }
          >
            <h3 className="font-medium text-gray-900">
              {category.category_name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {
                items.filter((item) => item.item_category === category.category_name)
                  .length
              }{" "}
              items
            </p>
            <div className="mt-2">
              {subCategories.map((sub) => (
                <span 
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mr-2 mb-2"
                  key={sub.sub_category_id}
                >
                  {sub.sub_category_name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <InventoryTable
          items={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {showForm && (
        <InventoryForm
          itemId={editingItemId}
          onClose={() => {
            setShowForm(false);
            setEditingItemId(null);
            setItems;
          }}
        />
      )}
    </div>
  );
};
