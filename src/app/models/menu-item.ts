export interface MenuItem {
  id: number;
  name: string;
  description?: string;  // fixed typo
  price?: number;
  tags: string[];
  protein?: number;
  calories?: number;
  imageUrl?: string;
  count?: number; 
}
