export interface Sub_Category {
  sub_category_id: number;
  sub_category_name: string;
  category_id: number;
  Category: Category[];
}
export interface Category {
  category_id: number;
  category_name: string;
}
