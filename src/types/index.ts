// Типы данных 
export type ItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное'; 
 
export const CategoryMapping: Record<ItemCategory, string> = { 
  'софт-скил': 'soft',  
  'хард-скил': 'hard', 
  'другое': 'other', 
  'кнопка': 'button', 
  'дополнительное': 'additional', 
}; 

// Тип для данных товара с сервера (без inBasket)
export interface ServerItem {
  id: string;
  description: string;
  category: ItemCategory;
  image: string;
  price: number | null;
  title: string;
}

// Тип для товара в клиентском приложении
export interface Item extends ServerItem {
  itemIndex: number;
  inBasket: boolean;
}
 
export interface Showcase { 
  items: Item[]; 
  getItem(id: string): Item | undefined; 
} 
 
export interface Basket { 
  // Храним только ID товаров в корзине
  itemIds: Set<string>;
  addItem(itemId: string): void; 
  alreadyInBasket(itemId: string): boolean; 
  clear(): void; 
  getTotal(items: Item[]): number; // Принимаем массив товаров для расчета
  getCount(): number; 
  removeItem(itemId: string): void; 
} 
 
export type PaymentMethod = 'card' | 'cash' | 'null'; 
 
export interface OrderFormData { 
  address: string; 
  email: string; 
  payment: PaymentMethod; 
  phone: string; 
} 
 
export interface Order extends OrderFormData { 
  clear(): void; 
  getOrderData(): OrderFormData; 
} 
 
export type ApiMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH'; 
 
export interface ApiClient {  
  baseUrl: string; 
  get<T>(uri: string): Promise<T>; 
  post<T>(uri: string, data: object, method?: ApiMethod): Promise<T>; 
} 
 
export interface OrderResult { 
  id?: string; 
  total?: number; 
  error?: string; 
  code?: number; 
}