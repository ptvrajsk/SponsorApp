export interface Item {
  id: number;
  name: string;
  price: number;
  imageUrl?: string; // NEW: image data URL
}

export interface Sponsorship {
  id: number;
  itemId: number;
  sponsorName: string;
  amount: number;
}

export type UserRole = "admin" | "user" | null;
