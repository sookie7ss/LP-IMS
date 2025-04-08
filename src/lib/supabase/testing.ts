import { supabase } from "./createclient"

export const getUsers = async () => {
    const { data, error } = await supabase
        .from('table_testing')
        .select('*')
    
    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    console.log("Fetched users:", data);
    return data;
}