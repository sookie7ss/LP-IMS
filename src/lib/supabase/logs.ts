import { supabase } from "./createclient";
import { Logs } from "../../interface/interfaceLogs";

const isLogsArray = (data: any): data is Logs[] => {
    return Array.isArray(data) && data.every(item => 
        item && typeof item.log_id === 'number' && typeof item.log_name === 'string'
    );
};

export const getLogs = async (): Promise<Logs[]> => {
  const { data, error } = await supabase
    .from("Activity_Logs")
    .select(`
      log_id,
      log_type,
      log_description,
      log_date,
    `)

  if (error) {
    console.error("Error fetching logs:", error);
    return [];
  }

  if (!isLogsArray(data)) {
    console.error("Data not matching expected Logs[] format:", data);
    return [];
  }

  console.log("Fetched logs:", data);
  return data as Logs[];
};