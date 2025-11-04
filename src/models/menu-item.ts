export interface menuItem {
  id: string;
  name: string;
  descripton?: string;
  price?: number;
  tags: string[];
  // optional nutrition info
  protein?: number;
  calories?: number;
  // optional image url for the menu item
  imageUrl?: string;
}
