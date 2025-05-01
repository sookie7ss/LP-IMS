import { supabase } from "./createclient";

// Define the shape of your item
export interface ItemInput {
  item_name: string;
  item_category: string;
  item_sub_category: string;
  item_location: string;
  purchase_date?: string;
  status: string;
  usage_history: Array<{
    userId: string;
    userName: string;
    startDate: string;
    endDate?: string;
  }>;
  createdAt?: string;
}

// Define the full item with the ID
export interface Item
  extends Omit<
    ItemInput,
    "item_name" | "itemCategory" | "itemSubCategory" | "itemLocation"
  > {
  item_id: number;
  item_name: string;
  item_category: string;
  item_sub_category: string;
  item_location: string;
  purchase_date: string;
  status: string;
  usage_history: Array<{
    userId: string;
    userName: string;
    startDate: string;
    endDate: string;
  }>;
  createdAt: string;
  lastUpdated: string;
  createdBy: string;
  lastUpdatedBy: string;
}

export const getItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase.from("Items").select("*");

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }
  console.log("Fetched items:", data);
  return data as Item[];
};

// Function to insert a new item
export const insertItem = async (
  itemData: ItemInput
): Promise<Item[] | null> => {
  const { data, error } = await supabase
    .from("Items")
    .insert([itemData])
    .select();

  if (error) {
    console.error("Error adding item:", error);
    return null;
  }
  console.log("Added item:", data);
  return data as Item[];
};
