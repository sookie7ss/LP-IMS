import { supabase } from "./createclient";
import { Category } from "../../interface/interfaceCategories";

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("Category")
    .select(`
      category_id,
      category_name,
      Sub_Category(
          sub_category_id,
          sub_category_name     
      )
    `)
    .order('category_name', { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  console.log("Fetched categories:", data);
  return data as Category[];
};
