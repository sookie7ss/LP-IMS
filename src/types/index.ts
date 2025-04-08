export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  active: boolean;
}
export interface InventoryItem {
  id: string;
  item_name: string;
  item_category: string;
  item_sub_category: string;
  location: string;
  purchaseDate: string;
  supplier: string;
  cost: number;
  status:
    | "Active - Currently Used"
    | "Active - Not Currently Used"
    | "Inactive - Defective"
    | "Disposed";
  remarks?: string;
  last_update: string;
  lastUpdatedBy: string;
  createdBy: string;
  createdAt: string;
  usageHistory: {
    userId: string;
    userName: string;
    startDate: string;
    endDate?: string;
  }[];
}

export interface Location {
  id: string;
  name: string;
}
