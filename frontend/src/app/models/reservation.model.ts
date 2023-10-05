export interface IReservation {
  id?: number;
  date?: string;
  amountPeople: number;
  obs: string;
  user_id?: number;
  status: string;
  User?: { name: string; email: string };
}
