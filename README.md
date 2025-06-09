## Стек технологий

- **HTML** — разметка страниц
- **SCSS** — стилизация интерфейса
- **TypeScript** — типизированная логика приложения
- **Webpack** — сборка и оптимизация проекта

---

## Структура проекта



```
src/
├── components/         # UI-компоненты
│   └── base/           # Базовые компоненты и наследование
├── pages/
│   └── index.html      # Главная страница
├── scss/
│   └── styles.scss     # Основные стили
├── types/
│   └── index.ts        # Описание типов данных
├── utils/
│   ├── constants.ts    # Константы
│   └── utils.ts        # Вспомогательные функции
└── index.ts            # Точка входа приложения
```

---

## Установка и запуск

1. Установите зависимости:

   ```bash
   npm install
   # или
   yarn
   ```

2. Запустите проект в режиме разработки:

   ```bash
   npm run start
   # или
   yarn start
   ```

3. Для сборки проекта используйте:

   ```bash
   npm run build
   # или
   yarn build
   ```

---

## Архитектура

Проект реализован по паттерну **MVP (Model-View-Presenter)**:

- **Model** — работа с данными и API (`Api`, типы данных)
- **View** — отображение интерфейса (наследники `Component`)
- **Presenter** — связывает Model и View, управляет логикой и событиями (`EventEmitter`)

---
## Базовые классы

- **Api** — взаимодействие с внешними сервисами через HTTP-запросы.
- **Component<T>** — абстрактный базовый класс для UI-компонентов.
- **EventEmitter** — реализация паттерна "Наблюдатель" для управления событиями.



## Типы данных

```ts
// Категории товаров
export type ItemCategory = 'софт скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';

// Сопоставление категорий с API
export const CategoryMapping: Record<ItemCategory, string> = {
   'софт скил': 'soft',
   'хард-скил': 'hard',
   'другое': 'other',
   'кнопка': 'button',
   'дополнительное': 'additional',
};

// Описание товара
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

// Витрина товаров
export interface Showcase {
   items: Item[];
   getItem(id: string): Item | undefined;
}

// Корзина покупок
export interface Basket {
   items: Item[];
   addItem(item: Item): void;
   alreadyInBasket(itemId: string): boolean;
   clear(): void;
   getTotal(): number;
   getCount(): number;
   removeItem(itemId: string): void;
}

// Способы оплаты
export type PaymentMethod = 'card' | 'cash' | 'null';

// Данные формы заказа
export interface OrderFormData {
   address: string;
   email: string;
   payment: PaymentMethod;
   phone: string;
}

// Заказ
export interface Order extends OrderFormData {
   clear(): void;
   getOrderData(): OrderFormData;
}

// HTTP-методы для API
export type ApiMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API-клиент
export interface Apiclient {
   baseUrl: string;
   get<T>(uri: string): Promise<T>;
   post<T>(uri: string, data: object, method?: ApiMethod): Promise<T>;
}

// Результат заказа
export interface OrderResult {
   id?: string;
   total?: number;
   error?: string;
   code?: number;
}
```