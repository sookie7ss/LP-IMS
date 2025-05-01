import { supabase } from "./createclient";
import { Status } from "../../interface/interfaceStatus"

const isStatusArray = (data: any): data is Status[] => {
    return Array.isArray(data) && data.every(item => 
        item && typeof item.status_id === 'number' && typeof item.status_name === 'string'
    );
};

export const getStatus = async (): Promise<Status[]> => {
    const { data, error } = await supabase
      .from("Status")
      .select('status_id, status_name')
      .order('status_id', { ascending: true });
  
    if (error) {
      console.error("Supabase error fetching status:", error);
      return [];
    }
  
    console.log("Raw data from Supabase:", data);
  
    if (!isStatusArray(data)) {
      console.error("Data not matching expected Status[] format:", data);
      return [];
    }
  
    return data;
  };
  