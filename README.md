# WebLarek

WebLarek — это учебное приложение для оформления заказов с витриной товаров, реализованное на TypeScript с архитектурой MVP.

---

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

Проект построен по паттерну **MVP (Model-View-Presenter)**:

- **Model** — отвечает за работу с данными и API (`Api`, типы данных)
- **View** — реализует отображение интерфейса (наследники `Component`)
- **Presenter** — связывает Model и View, управляет логикой и событиями (`EventEmitter`)

---

## Взаимодействие частей

**Взаимодействие происходит через EventEmitter:**
1. Пользователь совершает действие во View (например, нажимает кнопку).
2. View генерирует событие через EventEmitter.
3. Presenter слушает событие, вызывает соответствующий метод Model.
4. Model изменяет данные и может сгенерировать новое событие.
5. Presenter обновляет View, вызывая методы рендера.

---

## Описание классов

### View (Классы представления)

#### Component<T>
- **Назначение:** Абстрактный базовый класс для всех компонентов представления.
- **Наследование:** Базовый класс для всех UI-компонентов.
- **Конструктор:** `constructor(container: HTMLElement)`
- **Поля:**
  - `container: HTMLElement` — корневой DOM-элемент компонента.
- **Методы:**
  - `changeClassState(element: HTMLElement, className: string, state?: boolean): void` — изменяет состояние CSS-класса.
  - `changeDisabledState(element: HTMLElement, isDisabled: boolean): void` — включает/выключает атрибут disabled.
  - `render(data?: Partial<T>): HTMLElement` — обновляет состояние компонента и возвращает DOM-элемент.
  
#### Modal (наследник Component)
- **Назначение:** Отображение модальных окон.
- **Поля:**
   - `container: HTMLElement` — контейнер модального окна.
   - `closeButton: HTMLElement` — кнопка закрытия.
   - `isOpen: boolean` — состояние открытия окна.
- **Методы:**
   - `open(content: HTMLElement): void` — открывает модальное окно с переданным содержимым.
   - `close(): void` — закрывает модальное окно.
   - `handleClose(event: Event): void` — обработка события закрытия (например, по клику вне окна или на кнопку).
   - `setContent(content: HTMLElement): void` — устанавливает содержимое окна.

#### Basket (наследник Component)
- **Назначение:** Отображение корзины.
- **Поля:**
   - `items: Item[]` — список товаров в корзине.
   - `clearButton: HTMLElement` — кнопка очистки корзины.
   - `totalElement: HTMLElement` — элемент для отображения итоговой суммы.
- **Методы:**
   - `render(items: Item[]): HTMLElement` — обновляет список товаров и сумму.
   - `clear(): void` — очищает корзину.
   - `updateTotal(): void` — пересчитывает и отображает итоговую сумму.
   - `bindEvents(): void` — подписка на события (очистка, удаление товара).

#### Form (наследник Component)
- **Назначение:** Форма заказа.
- **Поля:**
   - `fields: { [key: string]: HTMLInputElement }` — поля ввода формы.
   - `submitButton: HTMLElement` — кнопка отправки.
   - `errors: { [key: string]: string }` — ошибки валидации.
- **Методы:**
   - `collectData(): OrderFormData` — сбор данных из формы.
   - `validate(): boolean` — валидация данных формы.
   - `submit(): void` — отправка формы.
   - `showErrors(errors: object): void` — отображение ошибок.

#### Success (наследник Component)
- **Назначение:** Отображение успешного оформления заказа.
- **Поля:**
   - `messageElement: HTMLElement` — сообщение об успехе.
   - `closeButton: HTMLElement` — кнопка закрытия.
- **Методы:**
   - `show(message: string): void` — отображает сообщение об успехе.
   - `close(): void` — закрывает сообщение.
   - `bindEvents(): void` — обработка события закрытия.

#### Page (наследник Component)
- **Назначение:** Основной контейнер страницы.
- **Поля:**
   - `container: HTMLElement` — корневой контейнер страницы.
   - `sections: { [key: string]: HTMLElement }` — секции страницы (корзина, каталог, форма и т.д.).
- **Методы:**
   - `render(sections?: object): HTMLElement` — рендерит страницу и секции.
   - `updateSection(name: string, content: HTMLElement): void` — обновляет содержимое секции.
   - `getSection(name: string): HTMLElement` — возвращает секцию по имени.

#### Card (наследник Component)
- **Назначение:** Карточка товара.
- **Поля:**
   - `imageElement: HTMLElement` — изображение товара.
   - `titleElement: HTMLElement` — название товара.
   - `priceElement: HTMLElement` — цена товара.
   - `addButton: HTMLElement` — кнопка "в корзину".
   - `item: Item` — данные товара.
- **Методы:**
   - `render(item: Item): HTMLElement` — отображает информацию о товаре.
   - `bindEvents(): void` — подписка на события (добавление в корзину).
   - `updateState(inBasket: boolean): void` — обновляет состояние кнопки.

#### Order (наследник Component)
- **Назначение:** Отображение информации о заказе.
- **Поля:**
   - `items: Item[]` — список товаров в заказе.
   - `totalElement: HTMLElement` — итоговая сумма заказа.
   - `submitButton: HTMLElement` — кнопка оформления заказа.
- **Методы:**
   - `render(order: Order): HTMLElement` — отображает заказ.
   - `submit(): void` — оформление заказа.
   - `updateItems(items: Item[]): void` — обновляет список товаров.

#### Contacts (наследник Component)
- **Назначение:** Отображение контактной информации.
- **Поля:**
   - `fields: { [key: string]: HTMLInputElement }` — поля контактов.
   - `submitButton: HTMLElement` — кнопка отправки.
- **Методы:**
   - `collectData(): object` — сбор контактных данных.
   - `submit(): void` — отправка контактных данных.
   - `validate(): boolean` — валидация данных.

#### AppData
- **Назначение:** Управляет всеми данными приложения.
- **Поля:**
  - `showcase: Showcase` — витрина товаров.
  - `basket: Basket` — корзина покупок.
  - `order: Order` — данные заказа.
  - `apiClient: ApiClient` — клиент для работы с сервером.
- **Методы:**
  - `loadProducts(): Promise<void>` — загрузка товаров с сервера.
  - `addToBasket(itemId: string): void` — добавляет товар в корзину.
  - `removeFromBasket(itemId: string): void` — удаляет товар из корзины.
  - `clearBasket(): void` — очищает корзину.
  - `createOrder(data: OrderFormData): Promise<OrderResult>` — оформляет заказ.

---

### EventEmitter (Посредник событий)

#### EventEmitter
- **Назначение:** Посредник для событий между слоями приложения (паттерн "Наблюдатель").
- **Поля:**
  - `_events: Map<EventName, Set<Subscriber>>` — карта событий и подписчиков.
- **Методы:**
  - `on(eventName: string, callback: Function): void` — подписка на событие.
  - `off(eventName: string, callback: Function): void` — отписка от события.
  - `emit(eventName: string, data?: object): void` — генерация события.
  - `onAll(callback: (event: EmitterEvent) => void): void` — подписка на все события.
  - `offAll(): void` — сброс всех подписчиков.
  - `trigger(eventName: string, context?: object): Function` — создание коллбек-триггера.

---

### Presenter

#### MainPresenter
- **Назначение:** Связывает Model и View, управляет логикой приложения, подписывается на события, реализует бизнес-логику.
- **Поля:**
  - `model: AppData` — модель данных приложения.
  - `view: Page` — основной компонент представления.
  - `events: EventEmitter` — посредник событий.
- **Методы:**
  - `init(): void` — инициализация приложения, загрузка данных, первичный рендер.
  - `bindEvents(): void` — подписка на события от View и Model.
  - `onAddToBasket(itemId: string): void` — обработка добавления товара в корзину.
  - `onRemoveFromBasket(itemId: string): void` — обработка удаления товара из корзины.
  - `onOrderSubmit(data: OrderFormData): void` — обработка оформления заказа.

---

## Типы данных и интерфейсы

В приложении используются следующие основные интерфейсы и типы данных:

### Item
- **Назначение:** Описывает структуру товара, отображаемого в витрине и корзине.
- **Поля:**
  - `id: string` — уникальный идентификатор товара.
  - `itemIndex: number` — индекс товара.
  - `title: string` — название товара.
  - `description: string` — описание товара.
  - `category: ItemCategory` — категория товара (`'софт скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное'`).
  - `image: string` — ссылка на изображение товара.
  - `price: number | null` — цена товара.
  - `inBasket: boolean` — находится ли товар в корзине.
- **Используется в:**  
  - `Showcase.items`
  - `Card`
  - `Order`

### Showcase
- **Назначение:** Коллекция всех товаров, доступных для покупки.
- **Поля:**
  - `items: Item[]`
- **Методы:**
  - `getItem(id: string): Item | undefined`
- **Используется в:**  
  - `AppData.showcase`
  - `Page`

### Basket
- **Назначение:** Коллекция идентификаторов товаров, добавленных в корзину.
- **Поля:**
  - `itemIds: Set<string>` — идентификаторы товаров в корзине.
- **Методы:**
  - `addItem(itemId: string): void` — добавить товар по id.
  - `alreadyInBasket(itemId: string): boolean` — проверить наличие товара в корзине.
  - `clear(): void` — очистить корзину.
  - `getTotal(items: Item[]): number` — получить сумму товаров (принимает массив товаров).
  - `getCount(): number` — количество товаров в корзине.
  - `removeItem(itemId: string): void` — удалить товар по id.
- **Используется в:**  
  - `AppData.basket`
  - `Basket`
  - `Order`

### OrderFormData
- **Назначение:** Данные, которые пользователь вводит при оформлении заказа.
- **Поля:**
  - `address: string`
  - `email: string`
  - `payment: PaymentMethod` (`'card' | 'cash' | 'null'`)
  - `phone: string`
- **Используется в:**  
  - `Form`
  - `AppData.createOrder`
  - `MainPresenter.onOrderSubmit`

### Order
- **Назначение:** Данные текущего заказа пользователя.
- **Наследует:** `OrderFormData`
- **Методы:**
  - `clear(): void`
  - `getOrderData(): OrderFormData`
- **Используется в:**  
  - `AppData.order`
  - `Order`

### OrderResult
- **Назначение:** Результат оформления заказа, возвращаемый сервером.
- **Поля:**
  - `id?: string`
  - `total?: number`
  - `error?: string`
  - `code?: number`
- **Используется в:**  
  - `AppData.createOrder`
  - `MainPresenter`
  - `Success`

### PaymentMethod
- **Назначение:** Способ оплаты заказа.
- **Тип:** `'card' | 'cash' | 'null'`
- **Используется в:**  
  - `OrderFormData.payment`

### ApiClient
- **Назначение:** Интерфейс клиента для работы с сервером.
- **Поля:**
  - `baseUrl: string`
- **Методы:**
  - `get<T>(uri: string): Promise<T>`
  - `post<T>(uri: string, data: object, method?: ApiMethod): Promise<T>`
- **Используется в:**  
  - `AppData.apiClient`

---

## События приложения

Все процессы реализованы через события, которые обрабатывает `EventEmitter`. Это обеспечивает гибкое взаимодействие между компонентами и слоями приложения.

| Событие                    | Генерирует (класс/слой) | Слушает (класс/слой) | Описание обработки                           |
|----------------------------|-------------------------|----------------------|----------------------------------------------|
| `product:addToBasket`      | Card (View)             | MainPresenter        | Добавление товара в корзину                  |
| `product:removeFromBasket` | Basket/Card (View)      | MainPresenter        | Удаление товара из корзины                   |
| `basket:clear`             | Basket (View)           | MainPresenter        | Очистка корзины                              |
| `order:submit`             | Form (View)             | MainPresenter        | Отправка формы заказа                        |
| `order:success`            | AppData (Model)         | MainPresenter/View   | Заказ успешно оформлен, обновление интерфейса|
| `order:error`              | AppData (Model)         | MainPresenter/View   | Ошибка при оформлении заказа                 |
| `modal:open`               | Любой View              | MainPresenter        | Открытие модального окна                     |
| `modal:close`              | Любой View              | MainPresenter        | Закрытие модального окна                     |
| `form:change`              | Form (View)             | MainPresenter        | Изменение данных в форме заказа              |

**Пример сценария взаимодействия:**
1. Пользователь кликает "Добавить в корзину" на карточке товара (`Card`).
2. Компонент `Card` генерирует событие `product:addToBasket` с id товара.
3. `MainPresenter` слушает это событие, вызывает метод `addToBasket` у `AppData`.
4. После обновления данных, `AppData` может сгенерировать событие для обновления корзины.
5. `MainPresenter` обновляет компонент `Basket` через метод `render`.

---