import { supabase } from "./createclient";

export const getItems = async () => {
    const { data, error } = await supabase
        .from('Items')
        .select('*')
    
    if (error) {
        console.error("Error fetching items:", error);
        return [];
    }
    console.log("Fetched items:", data);
    return data;
}

export const addItem = async (itemData: any) => {
    const { data, error } = await supabase
        .from('Items')
        .insert({
            item_name: itemData.item_name,
            item_sub_category: itemData.item_sub_category,
            item_category: itemData.item_category,
            location: itemData.location,
            last_update: itemData.last_update,
            status: itemData.status,
        })
    
    if (error) {
        console.error("Error adding item:", error);
        return null;
    }
    console.log("Added item:", data);
    return data;
}