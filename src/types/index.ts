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
  
 