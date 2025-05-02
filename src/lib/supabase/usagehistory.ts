import { supabase } from "./createclient";
import { UsageHistory } from "../../interface/interfaceUsageHistory";

const isUsageHistoryArray = (data: any): data is UsageHistory[] => {
    return Array.isArray(data) && data.every(item => 
        item && typeof item.userId === 'number' && typeof item.userName === 'string'
    );
};

export const getUsageHistory = async (): Promise<UsageHistory[]> => {
  const { data, error } = await supabase
    .from("Items")
    .select(`
      usage_history
    `)

  if (error) {
    console.error("Error fetching usage history:", error);
    return [];
  }

  if (!isUsageHistoryArray(data)) {
    console.error("Data not matching expected UsageHistory[] format:", data);
    return [];
  }

  console.log("Fetched UsageHistory:", data);
  return data as UsageHistory[];
};