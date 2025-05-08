export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  active: boolean;
}

export interface InventoryItem {
  item_id?: number;
  item_name: string;
  item_category: string;
  item_sub_category: string;
  item_location: string;
  purchaseDate?: string;
  item_supplier?: string;
  item_cost?: number;
  status: string;
  item_remarks?: string;
  usage_history: Array<{ userId: string; userName: string; startDate: string; endDate?: string }>;
  createdAt: string;
  lastUpdated: string;
  createdBy: string;
  lastUpdatedBy: string;
}
