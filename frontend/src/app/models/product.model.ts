export interface Product {
  id?: string;
  name: string;
  category: 'laptop' | 'phone';
  price: number;
  specs: string;
  inStock: boolean;
}