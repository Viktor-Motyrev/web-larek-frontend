// Типы данных 
export type ItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное'; 
 
export const CategoryMapping: Record<ItemCategory, string> = { 
  'софт-скил': 'soft',  
  'хард-скил': 'hard', 
  'другое': 'other', 
  'кнопка': 'button', 
  'дополнительное': 'additional', 
}; 


export interface ServerItem {
  id: string;
  description: string;
  category: ItemCategory;
  image: string;
  price: number | null;
  title: string;
}

// Убираем избыточный тип Item, используем ServerItem напрямую
export type Item = ServerItem;
 
export interface Showcase { 
  items: ServerItem[]; 
  getItem(id: string): ServerItem | undefined; 
} 
 
export interface Basket { 
  // Храним только ID товаров в корзине
  itemIds: Set<string>;
  addItem(itemId: string): void; 
  alreadyInBasket(itemId: string): boolean; 
  clear(): void; 
  getTotal(items: ServerItem[]): number; // Принимаем массив товаров для расчета
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
  id: string;
  clear(): void; 
  getOrderData(): OrderFormData; 
} 
 
export type ApiMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH'; 
 
export interface ApiClient {  
  baseUrl: string; 
  get<T>(uri: string): Promise<T>; 
  post<T>(uri: string, data: object, method?: ApiMethod): Promise<T>; 
} 

// Добавляем правильный интерфейс для класса Api
export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<T>;
}

export interface OrderResult { 
  id?: string; 
  total?: number; 
  error?: string; 
  code?: number; 
}