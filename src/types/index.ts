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
 
export interface Showcase { 
  items: ServerItem[]; 
  getItem(id: string): ServerItem | undefined; 
} 
 
export interface Basket { 
  // Убираем прямое свойство itemIds 
  addItem(itemId: string): void; 
  alreadyInBasket(itemId: string): boolean; 
  clear(): void; 
  getCount(): number; 
  removeItem(itemId: string): void; 
  // Добавляем методы для работы с данными без прямого доступа к itemIds
  getItemIds(): Set<string>;
  getItems(): string[];
} 
 
export type PaymentMethod = 'card' | 'cash' | 'null'; 
 
export interface OrderFormData { 
  address: string; 
  email: string; 
  payment: PaymentMethod; 
  phone: string; 
} 
 
export interface Order { 
  clear(): void; 
  getOrderData(): OrderFormData; 
  setFieldData<T extends keyof OrderFormData>(field: T, value: OrderFormData[T]): void;
  validateOrderForm(msg: string): void;
  validateContactForm(msg: string): void;
} 
 
export type ApiMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH'; 
 
export interface ApiClient {  
  baseUrl: string; 
  get<T>(uri: string): Promise<T>; 
  post<T>(uri: string, data: object, method?: ApiMethod): Promise<T>; 
} 

// Добавляем  интерфейс для класса Api
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