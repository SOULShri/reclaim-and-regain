
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  contactNumber?: string;
  role: "user" | "admin";
}

export type ItemStatus = "lost" | "found" | "claimed" | "resolved";

export type ItemCategory = 
  | "electronics" 
  | "stationery" 
  | "clothing" 
  | "accessories" 
  | "books" 
  | "documents" 
  | "other";

export type Item = {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  images: string[];
  location: string;
  date: string;
  reportedBy: User;
  createdAt: string;
  updatedAt: string;
}

export type ItemFormData = Omit<Item, "id" | "reportedBy" | "createdAt" | "updatedAt">;
