import { supabase } from "./createclient";
import { OfficeLocation } from "../../interface/interfaceLocation";

const isOfficeLocationArray = (data: any): data is OfficeLocation[] => {
    return Array.isArray(data) && data.every(item => 
        item && typeof item.location_id === 'string' && typeof item.location_name === 'string'
    );
};

export const getLocations = async (): Promise<OfficeLocation[]> => {
    const { data, error } = await supabase
      .from("Locations")
      .select('location_id, location_name')
      .order('location_id', { ascending: true });
  
    if (error) {
      console.error("Supabase error fetching locations:", error);
      return [];
    }
  
    console.log("Raw data from Supabase:", data);
  
    if (!isOfficeLocationArray(data)) {
      console.error("Data not matching expected OfficeLocation[] format:", data);
      return [];
    }
  
    return data;
  };
  