import { supabase } from "./createclient";
import { UsageHistory } from "../../interface/interfaceUsageHistory";

export const getUsageHistory = async (): Promise<UsageHistory[]> => {
  const { data, error } = await supabase.from("Items").select(`
      usage_history
    `);

  if (error) {
    console.error("Error fetching usage history:", error);
    return [];
  }

  // Extract usage_history from each item and flatten the array
  if (data && Array.isArray(data)) {
    // Extract usage_history arrays from each item
    const usageHistories = data
      .filter((item) => item.usage_history && Array.isArray(item.usage_history))
      .map((item) => item.usage_history)
      .flat();

    console.log("Fetched UsageHistory:", usageHistories);
    return usageHistories;
  }

  console.error("Data not matching expected format:", data);
  return [];
};
