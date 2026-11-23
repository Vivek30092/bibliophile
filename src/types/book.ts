export type BookAvailability = 'Available' | 'Rented' | 'Reserved' | 'Coming Soon' | 'Unavailable';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  isbn?: string | null;
  pages?: number;
  condition?: string;
  rental_price: number;
  rental_duration: number;
  security_deposit: number;
  availability: BookAvailability;
  cover_image: string;
  cover_images?: string[];
  featured?: boolean;
  mrp?: number | null;
  is_archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BookFilterState {
  search: string;
  genre: string;
  availability: string; // 'all' | 'Available' | 'Rented' | 'Coming Soon'
}
