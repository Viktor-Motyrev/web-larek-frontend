# WebLarek

WebLarek — это учебное приложение для оформления заказов с витриной товаров, реализованное на TypeScript с архитектурой MVP.

---

## Стек технологий

- **HTML** — разметка страниц
- **SCSS** — стилизация интерфейса
- **TypeScript** — типизированная логика приложения
- **Webpack 5** — сборка и оптимизация проекта
- **Babel** — транспиляция JavaScript
- **PostCSS** — обработка CSS
- **ESLint + Prettier** — линтинг и форматирование кода

---

## Структура проекта

```
src/
├── components/         # UI-компоненты
│   ├── base/           # Базовые компоненты и наследование
│   │   ├── api.ts      # HTTP-клиент для работы с API
│   │   ├── component.ts # Базовый класс для UI-компонентов
│   │   └── events.ts   # Система событий
│   ├── AppAPI.ts       # API для работы с сервером
│   ├── AppPage.ts      # Главная страница приложения
│   ├── Basket.ts       # Модель корзины
│   ├── BasketView.ts   # Представление корзины
│   ├── CardView.ts     # Карточки товаров
│   ├── ContactsFormView.ts # Форма контактных данных
│   ├── FormView.ts     # Базовый класс формы
│   ├── Modal.ts        # Модальное окно
│   ├── Order.ts        # Модель заказа
│   ├── OrderFormView.ts # Форма заказа
│   ├── Showcase.ts     # Модель витрины товаров
│   └── SuccessView.ts  # Окно успешного заказа
├── pages/
│   └── index.html      # Главная страница
├── scss/
│   ├── _variables.scss # Переменные SCSS
│   ├── mixins/         # Миксины
│   └── styles.scss     # Основные стили
├── types/
│   └── index.ts        # Описание типов данных
├── utils/
│   ├── constants.ts    # Константы приложения
│   └── utils.ts        # Вспомогательные функции
├── vendor/             # Внешние библиотеки и шрифты
└── index.ts            # Точка входа приложения
```

---

## Установка и запуск

### Установка зависимостей

```bash
npm install
# или
yarn
```

### Запуск в режиме разработки

```bash
npm run start
# или
yarn start
```

### Сборка проекта

```bash
# Сборка для разработки
npm run build:dev

# Сборка для продакшена
npm run build
# или
yarn build
```

---

## Архитектура

Проект построен по паттерну **MVP (Model-View-Presenter)**:

- **Model** — отвечает за работу с данными и API (`Api`, `Showcase`, `Basket`, `Order`)
- **View** — реализует отображение интерфейса (наследники `Component`)
- **Presenter** — связывает Model и View, управляет логикой и событиями (`EventEmitter`)

---

## Взаимодействие частей

**Взаимодействие происходит через EventEmitter:**

1. Пользователь совершает действие во View (например, нажимает кнопку)
2. View генерирует событие через EventEmitter
3. Presenter слушает событие, вызывает соответствующий метод Model
4. Model изменяет данные и может сгенерировать новое событие
5. Presenter обновляет View, вызывая методы рендера

---

## Основные классы и их назначение

### Базовые классы

#### Класс `Api`

Реализует базовую логику отправки HTTP-запросов. В конструктор передаётся базовый адрес сервера и, при необходимости, объект с заголовками.

**Методы:**
- `get<T>(endpoint)` — выполняет GET-запрос на указанный эндпоинт, возвращает промис с ответом сервера
- `post<T>(endpoint, data, method = 'POST')` — отправляет данные в формате JSON на указанный эндпоинт. Метод запроса можно переопределить

#### Класс `EventEmitter`

Брокер событий для подписки и генерации событий в приложении. Используется для связи между слоями.

**Методы:**
- `on<T>(event, handler)` — подписка на событие
- `emit<T>(event, data)` — генерация события
- `onAll(callback)` — подписка на все события
- `trigger<T>(event, context)` — создание триггера события

#### Класс `Component<T>`

Базовый абстрактный дженерик-класс для всех UI-компонентов (View). В конструктор передаётся DOM-элемент-контейнер.

**Методы:**
- `render(data?: Partial<T>)` — обновляет содержимое компонента
- `changeClassState(element, className, state?)` — изменяет состояние CSS-класса
- `changeDisabledState(element, isDisabled)` — управляет атрибутом `disabled`

**Свойства:**
- `containerElement` — геттер для доступа к контейнеру компонента

---

### Слой данных

#### Класс `Showcase`

Отвечает за хранение и управление карточками товаров.

**Конструктор:**
- `constructor(events: IEvents)` — создаёт экземпляр витрины товаров, принимает объект событий для обработки пользовательских действий

**Методы:**
- `set items(items: ServerItem[])` — устанавливает список товаров для отображения на витрине
- `get items()` — возвращает текущий список товаров витрины
- `getItem(itemId: string)` — возвращает товар по его идентификатору из списка витрины

#### Класс `Basket`

Хранит товары, добавленные в корзину.

**Конструктор:**
- `constructor(events: IEvents)` — создаёт экземпляр корзины, принимает объект событий для обработки пользовательских действий

**Свойства:**
- `itemIds: Set<string>` — множество идентификаторов товаров в корзине

**Методы:**
- `addItem(itemId: string): void` — добавляет товар в корзину по его идентификатору
- `get items()` — возвращает список товаров, добавленных в корзину
- `removeItem(itemId: string)` — удаляет товар из корзины по его идентификатору
- `alreadyInBasket(itemId: string)` — проверяет, находится ли товар с указанным идентификатором в корзине
- `clear(): void` — очищает корзину
- `getTotal(items: ServerItem[])` — возвращает общую стоимость всех товаров в корзине
- `getCount()` — возвращает количество товаров в корзине

#### Класс `Order`

Хранит и валидирует данные заказа.

**Конструктор:**
- `constructor(events: IEvents)` — создаёт экземпляр заказа, принимает объект событий для обработки пользовательских действий

**Методы:**
- `clear()` — очищает все данные заказа
- `validateOrderForm(msg: string)` — проверяет корректность заполнения формы заказа, возвращает результат валидации и сообщение об ошибке
- `validateContactForm(msg: string)` — проверяет корректность заполнения контактных данных, возвращает результат валидации и сообщение об ошибке
- `setFieldData(field, value)` — устанавливает значение указанного поля заказа
- `getOrderData()` — возвращает объект с текущими данными заказа

**Сеттеры и геттеры:**
- Для полей заказа (`id`, `address`, `phone`, `email`, `payment`) — позволяют установить или получить значения соответствующих полей заказа

---

### Слой представления

Все классы отвечают за отображение данных внутри DOM-контейнеров.

#### Класс `Modal`

Модальное окно приложения. Управляет открытием/закрытием, обработкой событий клавиатуры и кликов.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — создаёт экземпляр модального окна, принимает DOM-контейнер и объект событий для обработки пользовательских действий

**Методы:**
- `open()`, `close()` — открывает или закрывает модальное окно, а также управляет обработчиками событий клавиатуры и кликов для корректной работы модали
- `set content(content: HTMLElement)` — устанавливает содержимое модального окна

#### Класс `FormView<T>`

Базовый класс формы, используется внутри `Modal`.

**Конструктор:**
- `constructor(form: HTMLFormElement, events: IEvents)` — создаёт экземпляр формы, принимает DOM-элемент формы и объект событий для обработки пользовательских действий

**Методы:**
- `set valid(value: boolean)` — устанавливает состояние валидности формы
- `set errors(message: string)` — отображает сообщение об ошибке или скрывает его, если ошибок нет

#### Класс `ContactsFormView`

Форма для ввода контактных данных.

**Конструктор:**
- `constructor(container: HTMLFormElement, events: IEvents)` — создаёт экземпляр формы для ввода контактных данных, принимает DOM-элемент формы и объект событий

**Методы:**
- `set email(value: string)` — устанавливает значение поля email в форме
- `set phone(value: string)` — устанавливает значение поля телефона в форме

#### Класс `OrderFormView`

Форма для оформления заказа.

**Конструктор:**
- `constructor(container: HTMLFormElement, events: IEvents)` — создаёт экземпляр формы для оформления заказа, принимает DOM-элемент формы и объект событий

**Методы:**
- `set address(value: string)` — устанавливает значение поля адреса в форме
- `set payment(method: PaymentMethod)` — устанавливает выбранный способ оплаты в форме

#### Класс `SuccessView`

Отображает результат успешного оформления заказа.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — создаёт экземпляр окна успешного оформления заказа, принимает DOM-контейнер и объект событий

**Методы:**
- `set total(value: number)` — устанавливает и отображает итоговую сумму заказа в окне успешного оформления

#### Класс `BasketView`

Список товаров в корзине.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — создаёт экземпляр представления корзины, принимает DOM-контейнер и объект событий

**Методы:**
- `set items(items: HTMLElement[])` — устанавливает и отображает список товаров в корзине
- `set total(price: number)` — устанавливает и отображает итоговую стоимость товаров в корзине

#### Класс `CardView` и наследники

Базовый класс карточки товара. От него наследуются:
- `CardShowcase` — карточка на витрине
- `CardBasket` — карточка в корзине
- `CardPreview` — карточка в предпросмотре

**Общие методы:**
- `set category(value: ItemCategory)` — устанавливает категорию товара для карточки
- `set image(value: string)` — устанавливает изображение товара в карточке
- `set price(value: number | null)` — устанавливает цену товара в карточке
- `set description(value: string)` — устанавливает описание товара в карточке
- `set id(value: string)` — устанавливает идентификатор товара для карточки
- `set title(value: string)` — устанавливает название товара в карточке
- `setItemIndex(value: number)` — устанавливает порядковый номер карточки (например, для отображения позиции в списке)
- `setInBasket(value: boolean)` — устанавливает состояние "добавлено в корзину" для карточки товара

#### Класс `AppPage`

Главная страница приложения.

**Конструктор:**
- `constructor(container: HTMLElement, events: IEvents)` — создаёт экземпляр главной страницы приложения, принимает DOM-контейнер и объект событий

**Методы:**
- `set galleryItems(items: HTMLElement[])` — устанавливает и отображает список карточек товаров на главной странице
- `set basketCount(value: number)` — устанавливает и отображает количество товаров в корзине
- `set scrollLocked(isLocked: boolean)` — блокирует или разблокирует прокрутку страницы (например, при открытии модального окна)

#### Класс `AppApi`

Обеспечивает взаимодействие с сервером через экземпляр класса `Api`.

**Конструктор:**
- `constructor(baseApi: ApiClient)` — создаёт экземпляр API-клиента, принимает базовый API-клиент

**Методы:**
- `getShowcase(): Promise<ServerItem[]>` — возвращает все доступные карточки товаров
- `getItemById(id: string): Promise<ServerItem>` — возвращает одну карточку по её id
- `postOrder(order: IOrderData, items: ServerItem[], cost: number): Promise<IOrderResponse>` — отправляет на сервер данные заказа и получает подтверждение этого заказа

---

## Типы данных

В приложении используются следующие основные типы данных:

### Категории товаров

```typescript
export type ItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';

export const CategoryMapping: Record<ItemCategory, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'другое': 'other',
  'кнопка': 'button',
  'дополнительное': 'additional',
};
```

### Описание товара

**ServerItem** — структура товара, получаемого с сервера:

```typescript
export interface ServerItem {
  id: string;
  description: string;
  category: ItemCategory;
  image: string;
  price: number | null;
  title: string;
}
```

**Item** — тип для клиента:

```typescript
export type Item = ServerItem;
```

### Витрина товаров

```typescript
export interface Showcase {
  items: ServerItem[];
  getItem(id: string): ServerItem | undefined;
}
```

### Корзина

В корзине хранятся только идентификаторы товаров:

```typescript
export interface Basket {
  itemIds: Set<string>;
  addItem(itemId: string): void;
  alreadyInBasket(itemId: string): boolean;
  clear(): void;
  getTotal(items: ServerItem[]): number; // Принимаем массив товаров для расчета
  getCount(): number;
  removeItem(itemId: string): void;
}
```

### Оформление заказа

**Способы оплаты:**

```typescript
export type PaymentMethod = 'card' | 'cash' | 'null';
```

**Данные формы заказа:**

```typescript
export interface OrderFormData {
  address: string;
  email: string;
  payment: PaymentMethod;
  phone: string;
}
```

**Интерфейс заказа:**

```typescript
export interface Order extends OrderFormData {
  id: string;
  clear(): void;
  getOrderData(): OrderFormData;
}
```

### Работа с API

```typescript
export type ApiMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiClient {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiMethod): Promise<T>;
}

// Интерфейс для класса Api
export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<T>;
}
```

### Результат оформления заказа

```typescript
export interface OrderResult {
  id?: string;
  total?: number;
  error?: string;
  code?: number;
}
```

---

## Сценарий взаимодействия компонентов

### Добавление товара в корзину

1. **Клик по кнопке "В корзину"** → `CardShowcase` генерирует событие `CardPreview: move_item_to_basket`
2. **EventEmitter** передает событие всем подписчикам
3. **Презентер** получает `itemID` и вызывает `basket.addItem(item.id)`
4. **Модель корзины** добавляет товар в `Set<string> itemIds`
5. **Обновление UI** → `page.basketCount = basket.getCount()` и `modal.close()`

### Оформление заказа

6. **Открытие корзины** → событие `page: openBasket` → функция `showBasket()`
7. **Отображение товаров** → создание `CardBasket` для каждого товара → `BasketView`
8. **Кнопка "Оформить"** → событие `basketView: showOrderForm` → `OrderFormView`
9. **Заполнение формы** → события `formView: orderForm.change` → валидация через `order.validateOrderForm()`
10. **Переход к контактам** → событие `formView: orderForm.submit` → `ContactsFormView`
11. **Заполнение контактов** → события `formView: contactsForm.change` → валидация
12. **Отправка заказа** → событие `formView: contactsForm.submit` → `api.postOrder()`
13. **Успешный ответ** → `basket.clear()` → `SuccessView` с итоговой суммой

### Дополнительные взаимодействия

- **Удаление товара**: `CardBasket: delete_from_basket` → `basket.removeItem()` → обновление корзины
- **Предпросмотр**: `CardShowcase: show_preview` → создание `CardPreview` → открытие модального окна
- **Блокировка прокрутки**: `modal: page.scrollLocked` → `page.scrollLocked = lock`
- **Завершение**: `successView: submit` → очистка корзины → закрытие модального окна

### Принципы взаимодействия

- **Слабая связанность**: компоненты не знают друг о друге напрямую
- **Централизованное управление**: все взаимодействия через EventEmitter
- **Разделение ответственности**: каждый компонент отвечает за свою область