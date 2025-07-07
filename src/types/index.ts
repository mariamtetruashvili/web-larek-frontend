// -------------------------------------------
// Типы данных, приходящие с API и отображаемые в UI
// -------------------------------------------

/**
 * Описание товара (карточки товара)
 */
export interface IProduct {
	id: string; // Уникальный идентификатор товара
	title: string; // Название товара
	image: string; // URL изображения товара
	description: string; // Описание товара
	selected: boolean; // Флаг: товар добавлен в корзину или нет
	category: string; // Категория товара (например, "книги", "инструменты")
	price: number | null; // Цена товара, может отсутствовать (null)
}

/**
 * Заказ, сформированный пользователем
 */
export interface IOrder {
	payment: string; // Способ оплаты (например, "наличные", "карта")
	total: number; // Общая сумма заказа
	address: string; // Адрес доставки
	phone: string; // Телефон покупателя
	email: string; // Email покупателя
	items: string[]; // Массив ID товаров в заказе
}

/**
 * Данные формы доставки (выбор оплаты и адреса)
 * Используется в CheckoutForm и AddressForm
 */
export interface IDeliveryData {
	payment: string; // Выбранный способ оплаты
	address: string; // Адрес доставки
}

/**
 * Контактные данные покупателя
 * Используется в CheckoutForm и ContactForm
 */
export interface IContactData {
	email: string; // Email покупателя
	phone: string; // Телефон покупателя
}

// -------------------------------------------
// Интерфейс для API клиента (CatalogService)
// -------------------------------------------

export interface ICatalogService {
	getProductList(): Promise<IProduct[]>; // Получить список товаров с сервера
	submitOrder(order: IOrder): Promise<void>; // Отправить сформированный заказ на сервер
}

// -------------------------------------------
// Интерфейсы для моделей (Model)
// -------------------------------------------

/**
 * Интерфейс модели корзины
 */
export interface ICartStorage {
	getTotalCount(): number; // Получить общее количество товаров в корзине
	calculateTotalPrice(): number; // Рассчитать итоговую сумму корзины
	addProduct(product: IProduct): void; // Добавить товар в корзину
	removeProduct(product: IProduct): void; // Удалить товар из корзины
	clearCart(): void; // Очистить корзину полностью
}

/**
 * Интерфейс модели текущего выбранного товара для предпросмотра
 */
export interface ICurrentItem {
	activeItem: IProduct | null; // Текущий выбранный товар (или null, если нет)
	setActiveItem(product: IProduct): void; // Установить активный товар для предпросмотра
}

/**
 * Интерфейс модели формы оформления заказа
 */
export interface ICheckoutForm {
	setDeliveryInfo(data: IDeliveryData): void; // Установить данные доставки
	validateDelivery(): boolean; // Проверить корректность данных доставки
	setContactInfo(data: IContactData): void; // Установить контактные данные
	validateContacts(): boolean; // Проверить корректность контактных данных
	composeOrder(): IOrder; // Сформировать итоговый объект заказа
}

// -------------------------------------------
// Интерфейсы для представлений (View)
// -------------------------------------------

/**
 * Представление корзины
 */
export interface ICartView {
	updateItemCount(count: number): void; // Обновить отображение количества товаров
	updateTotalPrice(price: number): void; // Обновить отображение итоговой суммы
}

/**
 * Представление товара в корзине
 */
export interface ICartProductView {
	setFormattedPrice(price: number | null): void; // Отформатировать и отобразить цену товара
}

/**
 * Представление карточки товара в каталоге
 */
export interface IProductCardView {
	setText(text: string): void; // Установить текст (название, описание)
	setFormattedPrice(price: number | null): void; // Установить и отформатировать цену
	setCategoryClass(category: string): void; // Применить CSS класс для категории товара
}

/**
 * Расширенное представление товара с деталями (модальное окно)
 */
export interface IProductPreviewView extends IProductCardView {
	toggleAvailability(isAvailable: boolean): void; // Показать или скрыть кнопку покупки в зависимости от наличия
}

/**
 * Форма выбора доставки и оплаты
 */
export interface IAddressFormView {
	highlightPaymentMethod(method: string): void; // Подсветить выбранный способ оплаты в UI
}

/**
 * Форма ввода контактных данных
 */
export interface IContactFormView {
	setEmail(email: string): void; // Установить email в форму
	setPhone(phone: string): void; // Установить телефон в форму
}

/**
 * Базовое модальное окно (Popup)
 */
export interface IPopupView {
	open(): void; // Открыть модальное окно
	close(): void; // Закрыть модальное окно
}

/**
 * Окно с сообщением об успешном заказе
 */
export interface ISuccessMessageView {
	setConfirmationText(text: string): void; // Установить текст с подтверждением успешного заказа
}

// -------------------------------------------
// Интерфейсы и перечисления для событий EventEmitter
// -------------------------------------------

/**
 * Список всех возможных событий в приложении
 */
export enum AppEvents {
	ProductAdded = 'product:add', // Товар добавлен в корзину
	ProductRemoved = 'product:remove', // Товар удалён из корзины
	OrderSubmitted = 'order:submit', // Заказ отправлен
	ModalOpened = 'modal:open', // Модальное окно открыто
	ModalClosed = 'modal:close', // Модальное окно закрыто
	DeliveryDataChanged = 'delivery:dataChanged', // Данные доставки изменены
	ContactDataChanged = 'contact:dataChanged', // Контактные данные изменены
}

/**
 * Интерфейсы для данных событий
 */
export interface IProductEvent {
	productId: string; // ID товара, связанного с событием
}

export interface IOrderEvent {
	orderData: IOrder; // Данные заказа, связанные с событием
}

export interface IModalEvent {
	productId?: string; // Опционально — ID товара для модального окна
}

export interface IDeliveryDataEvent {
	deliveryData: IDeliveryData; // Данные доставки, связанные с событием
}

export interface IContactDataEvent {
	contactData: IContactData; // Контактные данные, связанные с событием
}

// -------------------------------------------
// Интерфейс базового класса EventEmitter
// -------------------------------------------

export interface IEventEmitter {
	on(event: AppEvents, handler: (payload?: any) => void): void; // Подписаться на событие
	off(event: AppEvents, handler: (payload?: any) => void): void; // Отписаться от события
	emit(event: AppEvents, payload?: any): void; // Вызвать событие с необязательными данными
	onAll(handler: (event: AppEvents, payload?: any) => void): void; // Подписка на все события
	offAll(): void; // Отписаться от всех событий
	trigger(event: AppEvents, payload?: any): () => void; // Создать обработчик для события (callback)
}

// -------------------------------------------
// Интерфейсы для базовых UI-компонентов (Component, Form, Popup)
// -------------------------------------------

/**
 * Базовый UI-компонент
 */
export interface IComponent {
	render(): HTMLElement; // Отрисовать компонент и вернуть HTML-элемент
	setVisible(): void; // Сделать компонент видимым
	setHidden(): void; // Скрыть компонент
	setDisabled(disabled: boolean): void; // Установить состояние disabled (включено/выключено)
	setText(text: string): void; // Установить текстовое содержимое компонента
}

/**
 * Интерфейс модальной формы
 */
export interface IForm extends IComponent {
	setValid(valid: boolean): void; // Установить валидность формы (валидна/невалидна)
	setErrors(errors: string[]): void; // Установить список ошибок в форме
	inputChange(event: Event): void; // Обработчик изменения ввода пользователя
}

/**
 * Интерфейс модального окна
 */
export interface IPopup extends IComponent {
	open(): void; // Открыть модальное окно
	close(): void; // Закрыть модальное окно
}

/**
 * Интерфейс представления корзины
 */
export interface IBasketView {
	openBasket(): void; // Открыть окно корзины
	render(): void; // Отрисовать корзину
	updateItemCount(count: number): void; // Обновить количество товаров в корзине
	updateTotalPrice(price: number): void; // Обновить итоговую сумму корзины
}

/**
 * Интерфейс формы оформления заказа
 */
export interface IOrderFormView {
	validate(): boolean; // Проверить валидность данных формы
	submit(): void; // Отправить форму заказа
}

/**
 * Интерфейс модального окна с успешным сообщением
 */
export interface ISuccessModalView {
	open(): void; // Открыть модальное окно
	close(): void; // Закрыть модальное окно
	setMessage(text: string): void; // Установить текст сообщения
}
