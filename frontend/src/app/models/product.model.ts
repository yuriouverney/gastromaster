export interface IProduct {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  profileId?: number;
  image?: string;
  promotion?: boolean;
  promotion_percent?: number;
  category_id?: number;
}
