export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: string | number;
  imageUrl?: string | null;
  isNovelty?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  order?: number;
  createdAt?: string;
  products?: Product[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  message?: string;
  accessToken: string;
  admin: User;
}
