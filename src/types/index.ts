export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  active: boolean;
}
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  location: string;
  purchaseDate: string;
  supplier: string;
  cost: number;
  status: 'Active - Currently Used' | 'Active - Not Currently Used' | 'Inactive - Defective' | 'Disposed';
  remarks?: string;
  lastUpdated: string;
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
export interface Category {
  id: string;
  name: string;
  subCategories: string[];
}
export interface Location {
  id: string;
  name: string;
}