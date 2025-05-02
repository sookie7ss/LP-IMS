import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { InventoryItem } from "../types";
import { useUser } from "./UserContext";
import { Category, Sub_Category } from "../interface/interfaceCategories";
import { supabase } from "../lib/supabase/createclient";
import { getItems } from "../lib/supabase/items";
import { insertItem } from "../lib/supabase/items";
import { OfficeLocation } from "../interface/interfaceLocation";
import { getLocations } from "../lib/supabase/location";
import { getUsageHistory } from "../lib/supabase/usagehistory";

interface InventoryContextType {
  items: InventoryItem[];
  categories: Category[];
  subCategories: Sub_Category[];
  locations: OfficeLocation[];

  addItem: (
    item: Omit<InventoryItem, "id" | "createdAt" | "lastUpdated">
  ) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => InventoryItem | undefined;
  fetchSubCategories: (categoryId: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Sub_Category[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);

  const { currentUser } = useUser();

  const addItem = async (
    itemData: Omit<InventoryItem, "id" | "createdAt" | "lastUpdated">
  ) => {
    if (!currentUser) return;

    try {
      // Convert the InventoryItem fields to ItemInput format
      const itemInputData = {
        item_name: itemData.item_name,
        item_category: itemData.item_category,
        item_sub_category: itemData.item_sub_category,
        item_location: itemData.item_location,
        purchase_date: itemData.purchaseDate,
        status: itemData.status,
        usage_history: [itemData.usage_history.userId, itemData.usage_history.userName],
        createdAt: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };

      const result = await insertItem(itemInputData);

      if (result) {
        // Refresh items list after adding
        const items = await getItems();
        setItems(items || []);
      }
    } catch (error) {
      console.error("Error in addItem:", error);
    }
  };

  const updateItem = (id: string, itemData: Partial<InventoryItem>) => {
    if (!currentUser) return;
    const numericId = Number(id);
    setItems((prev) =>
      prev.map((item) =>
        item.item_id === numericId
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
    const numericId = Number(id);
    setItems((prev) => prev.filter((item) => item.item_id !== numericId));
  };

  const getItemById = (id: string) => {
    const numericId = Number(id);
    return items.find((item) => item.item_id === numericId);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("Category").select(`
      category_id,
      category_name
    `);
    if (error) {
      console.error("Error fetching categories:", error);
    } else if (data) {
      const formattedCategories = data.map((category) => ({
        category_id: category.category_id,
        category_name: category.category_name
      }));
      setCategories(formattedCategories); // Correctly format categories
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
      const formattedSubCategories = data.map((subCategory) => ({
        sub_category_id: subCategory.sub_category_id,
        sub_category_name: subCategory.sub_category_name,
        category_id: subCategory.category_id,
      }));
      setSubCategories(formattedSubCategories); // Correctly format subcategories
    }
  };

  const fetchLocations = async () => {
    const locs = await getLocations();
    setLocations(locs);
    console.log("Loaded locations into context:", locs);
  };

  const fetchUsageHistory = async () => {
    const usageHistory = await getUsageHistory();
    console.log("Fetched usage history:", usageHistory);
  };

  useEffect(() => {
    fetchCategories();
    fetchLocations();
    fetchUsageHistory();
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        subCategories,
        locations,
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
