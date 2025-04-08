import { supabase } from "./createclient";
import { Category } from "../../interface/interfaceCategories";
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from("Category").select(`
      category_id,
      category_name,
      Sub_Category(
          sub_category_id,
          sub_category_name     
      )
  `);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data as Category[];
};
