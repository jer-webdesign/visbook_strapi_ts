// Common TypeScript types used across the application

export interface Book {
  id: number | string;
  title: string;
  subtitle?: string;
  author: string;
  price: number;
  price_cad?: number;
  description?: string;
  filename?: string;
  image?: string;
  media_url?: {
    url: string;
  };
  genre?: string;
  publishedDate?: string;
  published_date?: string;
  number_of_pages?: number;
  ISBN_13?: string;
  ISBN_10?: string;
  average_rating?: number;
  rating_count?: number;
  isNewRelease?: boolean;
  isBestSeller?: boolean;
  quantity?: number;
}

export interface CartItem {
  id: number | string;
  title: string;
  author: string;
  price: number;
  price_cad?: number;
  quantity: number;
  filename?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  items: CartItem[];
  total: number;
  createdAt: Date | any;
  status?: string;
  paymentMethod?: string;
  shippingAddress?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface UserProfile {
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  homeAddress?: string;
  createdAt?: Date;
}
