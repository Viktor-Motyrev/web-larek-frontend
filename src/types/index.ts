// Типы данных
export type ItemCategory = 'софт скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';

export const CategoryMapping: Record<ItemCategory, string> = {
  'софт скил': 'soft', 
  'хард-скил': 'hard',
  'другое': 'other',
  'кнопка': 'button',
  'дополнительное': 'additional',
};

export interface Item {
  id: string;
  itemIndex: number;
  description: string;
  category: ItemCategory;
  image: string;
  price: number | null;
  title: string;
  inBasket: boolean;
}

export interface Showcase {
  items: Item[];
  getItem (id: string): Item | undefined;
}

export interface Basket {
  items: Item[];
  addItem (item: Item): void;
  alreadyInBasket (itemId: string): boolean;
  clear(): void;
  getTotal(): number;
  getCount(): number;
  removeItem (itemId: string): void;
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

export interface Apiclient { 
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
