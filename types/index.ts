export type Category = '食品' | '日用品' | 'その他';

export interface ShoppingItem {
  id: string;
  name: string;
  category: Category;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface FrequentItem {
  name: string;
  category: Category;
  count: number;
}
