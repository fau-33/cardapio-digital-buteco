export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: string | number;
  isNovelty?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  order?: string;
  createdAt?: string;
  products?: Product[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
