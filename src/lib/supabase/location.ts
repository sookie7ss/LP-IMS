import { supabase } from "./createclient";
import { Location } from "../../interface/interfaceLocation";

export const getLocations = async (): Promise<Location[]> => {
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
        return data as Location[];
}