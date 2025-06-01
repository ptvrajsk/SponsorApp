export interface Sponsorship {
  id: string; // was number
  itemId: string; // was number
  sponsorName: string;
  amount: number;
}

export interface Item {
  id: string; // was number
  name: string;
  price: number;
  imageUrl?: string;
  adminId?: string;
}

export type UserRole = "admin" | "user" | null;

