export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  tags?: string[];
  count?: number;
  spiciness?: number;
  sweetness?: number;
  saltLevel?: string;
  category?: string;
}
