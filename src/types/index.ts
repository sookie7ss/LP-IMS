export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  active: boolean;
}

export interface InventoryItem {
  id: number;
  itemName: string;
  itemCategory: string;
  itemSubCategory: string;
  itemLocation: string;
  purchaseDate?: string;
  status: string;
  usageHistory: Array<{ userId: string; userName: string; startDate: string; endDate?: string }>;
  createdAt: string;
  lastUpdated: string;
  createdBy: string;
  lastUpdatedBy: string;
}
