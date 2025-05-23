import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { InventoryItem, Location } from "../types";
import { useUser } from "./UserContext";
import { Category, Sub_Category } from "../interface/interfaceCategories";
import { supabase } from "../lib/supabase/createclient";

interface InventoryContextType {
  items: InventoryItem[];
  categories: Category[];
  subCategories: Sub_Category[];
  locations: Location[];

  addItem: (
    item: Omit<
      InventoryItem,
      "id" | "createdAt" | "lastUpdated" | "createdBy" | "lastUpdatedBy"
    >
  ) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => InventoryItem | undefined;
  fetchSubCategories: (categoryId: number) => void;
}
const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);
// Mock categories
// Mock locations
const mockLocations: Location[] = [
  {
    id: "loc-1",
    name: "LP1 Coworking",
  },
  {
    id: "loc-2",
    name: "LP2 Plus",
  },
  {
    id: "loc-3",
    name: "LP3 Suite",
  },
  {
    id: "loc-4",
    name: "LP4 Griffinstone",
  },
];
// Mock inventory items
const mockItems: InventoryItem[] = [
  {
    id: "item-1",
    item_name: 'Dell Monitor 24"',
    item_category: "IT Devices",
    item_sub_category: "Monitors",
    location: "LP1 Coworking",
    purchaseDate: "2023-01-15",
    supplier: "Dell Inc.",
    cost: 299.99,
    status: "Active - Currently Used",
    createdAt: "2023-01-16T10:00:00Z",
    last_update: "2023-01-16T10:00:00Z",
    createdBy: "user-1",
    lastUpdatedBy: "user-1",
    usageHistory: [
      {
        userId: "user-1",
        userName: "Admin User",
        startDate: "2023-01-16T10:00:00Z",
      },
    ],
  },
  // Add more mock items as needed
];
export const InventoryProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>(mockItems);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Sub_Category[]>([]);

  const { currentUser } = useUser();
  const addItem = (
    itemData: Omit<
      InventoryItem,
      "id" | "createdAt" | "lastUpdated" | "createdBy" | "lastUpdatedBy"
    >
  ) => {
    if (!currentUser) return;
    const newItem: InventoryItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      last_update: new Date().toISOString(),
      createdBy: currentUser.id,
      lastUpdatedBy: currentUser.id,
    };
    setItems((prev) => [...prev, newItem]);
  };
  const updateItem = (id: string, itemData: Partial<InventoryItem>) => {
    if (!currentUser) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...itemData,
              lastUpdated: new Date().toISOString(),
              lastUpdatedBy: currentUser.id,
            }
          : item
      )
    );
  };
  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  const getItemById = (id: string) => {
    return items.find((item) => item.id === id);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("Category").select(`
      category_id,
      category_name
    `);
    if (error) {
      console.error("Error fetching categories:", error);
    } else if (data) {
      setCategories(data);
    }
  };

  const fetchSubCategories = async (categoryId: number) => {
    const { data, error } = await supabase
      .from("Sub_Category")
      .select(
        `
      sub_category_id,
      sub_category_name,
      category_id,
      Category (
        category_id,
        category_name
      )
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
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        subCategories,
        locations: mockLocations,
        addItem,
        updateItem,
        deleteItem,
        getItemById,
        fetchSubCategories,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
