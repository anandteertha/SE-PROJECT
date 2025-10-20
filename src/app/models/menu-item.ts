export interface menuItem {
    id: string;
    name: string;
    descripton?: string;
    price?: number;
    tags: string[];
    protein?: number;
    calories?: number;
    imageUrl?: string;
}