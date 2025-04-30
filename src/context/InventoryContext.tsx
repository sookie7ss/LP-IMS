import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { InventoryItem } from "../types";
import { useUser } from "./UserContext";
import { Category, SubCategory } from "../interface/interfaceCategories";
import { supabase } from "../lib/supabase/createclient";
import { getItems } from "../lib/supabase/items";
import { insertItem } from "../lib/supabase/items";
import { OfficeLocation } from "../interface/interfaceLocation";
import { format } from "path";

interface InventoryContextType {
  items: InventoryItem[];
  categories: Category[];
  subCategories: SubCategory[];
  locations: OfficeLocation[];

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

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [locations, setLocations] = useState<OfficeLocation[]>([]);

  const { currentUser } = useUser();

  const addItem = async (
    itemData: Omit<
      InventoryItem,
      "id" | "createdAt" | "lastUpdated" | "createdBy" | "lastUpdatedBy"
    >
  ) => {
    if (!currentUser) return;
  
    const enrichedItem = {
      ...itemData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      createdBy: currentUser.id,
      lastUpdatedBy: currentUser.id,
    };

    const { data, error } = await insertItem(enrichedItem); // Supabase insert
  if (error) {
    console.error("Error adding item:", error);
    return;
  }
  if (data) {
    setItems((prev) => [...prev, ...data]); // Spread operator to add all items
  }
  };

  useEffect(() => {
    const loadItems = async () => {
      const items = await getItems(); // From items.ts
      setItems(items || []);
    };
    loadItems();
  }, []);

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
      const formattedCategories = data.map((category) => ({
        category_id: category.category_id,
        category_name: category.category_name,
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
    const { data, error } = await supabase
    .from("Locations")
    .select(
      `
      location_id,
      location_name
      `); // From location.ts
    if (error) {
      console.error("Error fetching locations:", error);
    } else if (data) {
      const formattedLocations = data.map((location) => ({
        location_id: location.location_id,
        location_name: location.location_name,
      }));
      setLocations(formattedLocations);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchLocations();
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