import { supabase } from "./createclient";

export const getCategories = async () => {
    const { data, error } = await supabase
        .from('Categories')
        .select('*')
    
    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
    console.log("Fetched categories:", data);
    return data;
}

export const getSubCategories = async () => {
    const { data, error } = await supabase
        .from('SubCategories')
        .select(`
            sub_category_id,
            sub_category_name,
            category_id
            Category(
            category_id,
            category_name )
            `
            )
        
    
    if (error) {
        console.error("Error fetching subcategories:", error);
        return [];
    }
    console.log("Fetched subcategories:", data);
    return data;
}