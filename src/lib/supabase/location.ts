import { supabase } from "./createclient";
import { OfficeLocation } from "../../interface/interfaceLocation";

export const getLocations = async (): Promise<OfficeLocation[]> => {
    const { data, error } = await supabase
        .from("Locations")
        .select(`
            location_id,
            location_name,
        `)
        .order('location_name', { ascending: true });

        if (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
        console.log("Fetched locations:", data);
        return data as OfficeLocation[];
};