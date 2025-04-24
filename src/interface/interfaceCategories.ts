export interface SubCategory {
  sub_category_id: number;
  sub_category_name: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  Sub_Category: SubCategory[];
}
