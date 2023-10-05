export interface ICoupon {
  id?: number;
  code?: string;
  value?: number;
  order_min_value?: number;
  description?: string;
  active?: boolean;
  expiration_date?: string;
}
