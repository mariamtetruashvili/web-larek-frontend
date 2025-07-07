# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## 🎯 Описание проекта

WEB-ларёк — мини-интернет-магазин товаров для веб-разработчиков.

Пользователь может:

- Просматривать каталог товаров
- Добавлять товары в корзину
- Удалять товары из корзины
- Открывать модальные окна с детальной информацией
- Проходить двухшаговое оформление заказа:
- Выбор способа оплаты и адреса доставки
- Ввод контактных данных (email, телефон)
- Получать подтверждение успешного заказа

## 🧠 Описание архитектуры

В проекте применена архитектура MVP (Model-View-Presenter), которая разделяет приложение на три основные сущности:

- Model — отвечает за получение и хранение данных (API, локальные данные пользователя).

- View — отвечает за отображение интерфейса и взаимодействие с пользователем.

- Presenter (EventEmitter) — связывает модель и представление, реагирует на события, передавая данные между слоями.

## 📚 Базовые классы

**Api**

Класс, реализующий универсальные методы взаимодействия с сервером через HTTP-запросы.

Методы:

- handleResponse(response: Response): Promise<object> — обрабатывает ответ от сервера.

- get(uri: string) — выполняет GET-запрос по указанному маршруту.

- post(uri: string, data: object, method: ApiPostMethods = 'POST') — выполняет POST/PUT/DELETE-запрос.

**EventEmitter**

Универсальный брокер событий, реализующий паттерн «Наблюдатель». Используется как Presenter.

Методы:

- on(event, handler) / off(event, handler) — добавление/удаление слушателя события.

- emit(event, payload) — уведомление всех подписчиков.

- onAll(handler) / offAll() — управление глобальными подписками.

- trigger(event, payload) — создаёт обработчик события, который можно использовать как коллбек.


## 📦 Модели (Model)


**CatalogService extends Api**

Обеспечивает загрузку и отправку данных по API.

Методы:

- getProductList() — получает список карточек с сервера.

- submitOrder() — отправляет заказ.

**CartStorage**

Обрабатывает состояние корзины пользователя.

Методы:

- getTotalCount() — возвращает количество товаров.

- calculateTotalPrice() — считает итоговую сумму корзины.

- addProduct() — добавляет товар в корзину.

- removeProduct() — удаляет товар из корзины.

- clearCart() — очищает корзину полностью.

**CurrentItem**

Хранит данные карточки, открытой в превью.

Метод:

- setActiveItem() — устанавливает карточку для подробного просмотра.


**CheckoutForm**

Работает с данными, вводимыми пользователем при оформлении заказа.

Методы:

- setDeliveryInfo() / validateDelivery() — адрес и способ оплаты.

- setContactInfo() / validateContacts() — почта и телефон.

- composeOrder() — формирует итоговый заказ.

## 🖼️ Представления (View)

**CartView**

Отображает окно корзины и его содержимое.

Методы:

- updateItemCount() — обновляет количество товаров.

- updateTotalPrice() — отображает сумму всех товаров.

**CartProduct**

Визуальный элемент товара в корзине.

Метод:

- setFormattedPrice() — форматирует цену в строку.


**ProductCard**

Карточка товара на главной странице.

Методы:

- setText() — устанавливает текст для DOM-элемента.

- setFormattedPrice() — отображает цену.

- setCategoryClass() — применяет категорийный стиль.

**ProductPreview extends ProductCard**

Модальное окно с деталями товара.

Метод:

- toggleAvailability() — проверяет наличие цены, отключает покупку при отсутствии.


**AddressForm**

Форма выбора доставки и оплаты.

Метод:

- highlightPaymentMethod() — визуально выделяет выбранный способ оплаты.


**ContactForm**

Форма ввода контактных данных (почта, телефон).

**Popup**

Базовый класс модальных окон.

Методы:

- open() — отображает окно.

- close() — закрывает окно.

**SuccessMessage**

Компонент, отображающий подтверждение успешного оформления заказа.

Дополнительные интерфейсы представлений:

- **IBasketView** — интерфейс для представления корзины с методами:
  - `openBasket()` — открыть корзину,
  - `render()` — отрисовать корзину,
  - `updateItemCount(count: number)` — обновить количество товаров,
  - `updateTotalPrice(price: number)` — обновить итоговую сумму.

- **IOrderFormView** — интерфейс для формы оформления заказа с методами:
  - `validate()` — проверить корректность данных,
  - `submit()` — отправить форму заказа.

- **ISuccessModalView** — интерфейс для модального окна успешного оформления заказа с методами:
  - `open()` — открыть окно,
  - `close()` — закрыть окно,
  - `setMessage(text: string)` — установить сообщение.


## 📦 Типы данных:

Подробности смотрите в src/types/index.ts.

```
// src/types/index.ts

// -------------------------------------------
// Типы данных, приходящие с API и отображаемые в UI
// -------------------------------------------

/**
 * Описание товара (карточки товара)
 */
interface IProduct {
    id: string;            // Уникальный идентификатор товара
    title: string;         // Название товара
    image: string;         // URL изображения товара
    description: string;   // Описание товара
    selected: boolean;     // Добавлен ли товар в корзину
    category: string;      // Категория товара (например, "книги", "инструменты")
    price: number | null;  // Цена товара, может отсутствовать (null)
  }
  
  /**
   * Заказ, сформированный пользователем
   */
 interface IOrder {
    payment: string;   // Способ оплаты (например, "наличные", "карта")
    total: number;     // Общая сумма заказа
    address: string;   // Адрес доставки
    phone: string;     // Телефон покупателя
    email: string;     // Email покупателя
    items: string[];   // Массив id товаров в заказе
  }
  
  /**
   * Данные формы доставки (выбор оплаты и адреса)
   * Используется в CheckoutForm, AddressForm
   */
 interface IDeliveryData {
    payment: string;
    address: string;
  }
  
  /**
   * Контактные данные покупателя
   * Используется в CheckoutForm, ContactForm
   */
  interface IContactData {
    email: string;
    phone: string;
  }
  
  // -------------------------------------------
  // Интерфейс для API клиента (CatalogService)
  // -------------------------------------------
  
  export interface ICatalogService {
    getProductList(): Promise<IProduct[]>;  // Получить список товаров
    submitOrder(order: IOrder): Promise<void>; // Отправить заказ на сервер
  }
  
  // -------------------------------------------
  // Интерфейсы для моделей (Model)
  // -------------------------------------------
  
  /**
   * Интерфейс модели корзины
   */
  export interface ICartStorage {
    getTotalCount(): number;              // Получить общее количество товаров
    calculateTotalPrice(): number;        // Получить итоговую сумму корзины
    addProduct(product: IProduct): void;  // Добавить товар в корзину
    removeProduct(product: IProduct): void; // Удалить товар из корзины
    clearCart(): void;                    // Очистить корзину
  }
  
  /**
   * Интерфейс модели текущего выбранного товара для предпросмотра
   */
  export interface ICurrentItem {
    activeItem: IProduct | null;          // Текущий выбранный товар
    setActiveItem(product: IProduct): void; // Установить активный товар
  }
  
  /**
   * Интерфейс модели формы оформления заказа
   */
  export interface ICheckoutForm {
    setDeliveryInfo(data: IDeliveryData): void;  // Установить данные доставки
    validateDelivery(): boolean;                   // Проверить корректность данных доставки
    setContactInfo(data: IContactData): void;     // Установить контактные данные
    validateContacts(): boolean;                    // Проверить корректность контактных данных
    composeOrder(): IOrder;                         // Сформировать объект заказа
  }
  
  // -------------------------------------------
  // Интерфейсы для представлений (View)
  // -------------------------------------------
  
  /**
   * Представление корзины
   */
  export interface ICartView {
    updateItemCount(count: number): void;   // Обновить количество товаров в UI
    updateTotalPrice(price: number): void;  // Обновить итоговую сумму в UI
  }
  
  /**
   * Представление товара в корзине
   */
  export interface ICartProductView {
    setFormattedPrice(price: number | null): void; // Отформатировать и показать цену
  }
  
  /**
   * Представление карточки товара в каталоге
   */
 interface IProductCardView {
    setText(text: string): void;                   // Установить текст (название, описание)
    setFormattedPrice(price: number | null): void; // Установить и отформатировать цену
    setCategoryClass(category: string): void;      // Установить CSS класс для категории
  }
  
  /**
   * Расширенное представление товара с деталями (модальное окно)
   */
  export interface IProductPreviewView extends IProductCardView {
    toggleAvailability(isAvailable: boolean): void; // Показать или скрыть кнопку покупки
  }
  
  /**
   * Форма выбора доставки и оплаты
   */
  export interface IAddressFormView {
    highlightPaymentMethod(method: string): void;  // Подсветить выбранный способ оплаты
  }
  
  /**
   * Форма ввода контактных данных
   */
  export interface IContactFormView {
    setEmail(email: string): void;
    setPhone(phone: string): void;
  }
  
  /**
   * Базовое модальное окно (Popup)
   */
  export interface IPopupView {
    open(): void;     // Открыть окно
    close(): void;    // Закрыть окно
  }
  
  /**
   * Окно с сообщением об успешном заказе
   */
  export interface ISuccessMessageView {
    setConfirmationText(text: string): void;  // Установить текст подтверждения заказа
  }
  
  // -------------------------------------------
  // Интерфейсы и перечисления для событий EventEmitter
  // -------------------------------------------
  
  /**
   * Список всех возможных событий в приложении
   */
  enum AppEvents {
    ProductAdded = 'product:add',
    ProductRemoved = 'product:remove',
    OrderSubmitted = 'order:submit',
    ModalOpened = 'modal:open',
    ModalClosed = 'modal:close',
    DeliveryDataChanged = 'delivery:dataChanged',
    ContactDataChanged = 'contact:dataChanged',
  }
  
  /**
   * Интерфейсы для данных событий
   */
  export interface IProductEvent {
    productId: string;
  }
  
  export interface IOrderEvent {
    orderData: IOrder;
  }
  
  export interface IModalEvent {
    productId?: string;  // Опционально — для модального окна с товаром
  }
  
  export interface IDeliveryDataEvent {
    deliveryData: IDeliveryData;
  }
  
  export interface IContactDataEvent {
    contactData: IContactData;
  }
  
  // -------------------------------------------
  // Интерфейс базового класса EventEmitter
  // -------------------------------------------
  
  export interface IEventEmitter {
    on(event: AppEvents, handler: (payload?: any) => void): void;
    off(event: AppEvents, handler: (payload?: any) => void): void;
    emit(event: AppEvents, payload?: any): void;
    onAll(handler: (event: AppEvents, payload?: any) => void): void;
    offAll(): void;
    trigger(event: AppEvents, payload?: any): () => void;
  }
  
  // -------------------------------------------
  // Интерфейсы для базовых UI-компонентов (Component, Form, Popup)
  // -------------------------------------------
  
  /**
   * Базовый UI-компонент
   */
  interface IComponent {
    render(): HTMLElement;
    setVisible(): void;
    setHidden(): void;
    setDisabled(disabled: boolean): void;
    setText(text: string): void;
  }
  
  /**
   * Интерфейс модальной формы
   */
  export interface IForm extends IComponent {
    setValid(valid: boolean): void;
    setErrors(errors: string[]): void;
    inputChange(event: Event): void;
  }
  
  /**
   * Интерфейс модального окна
   */
  export interface IPopup extends IComponent {
    open(): void;
    close(): void;
  }

/**
 * Интерфейс представления корзины
 */
export interface IBasketView {
  openBasket(): void;               // Открыть окно корзины
  render(): void;                  // Отрисовать корзину
  updateItemCount(count: number): void;  // Обновить количество товаров в корзине
  updateTotalPrice(price: number): void; // Обновить итоговую сумму корзины
}

/**
 * Интерфейс формы оформления заказа
 */
export interface IOrderFormView {
  validate(): boolean;              // Проверить валидность данных формы
  submit(): void;                  // Отправить форму заказа
}

/**
 * Интерфейс модального окна с успешным сообщением
 */
export interface ISuccessModalView {
  open(): void;                   // Открыть модальное окно
  close(): void;                  // Закрыть модальное окно
  setMessage(text: string): void; // Установить текст сообщения
}

 ```