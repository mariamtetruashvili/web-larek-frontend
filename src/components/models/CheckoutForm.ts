// src/models/CheckoutForm.ts
import { ICheckoutForm } from '../../types';
import { IDeliveryData, IContactData, IOrder } from '../../types';

/**
 * Класс для работы с формой оформления заказа
 * Хранит данные доставки и контактов,
 * выполняет валидацию и формирует итоговый заказ
 */
export class CheckoutForm implements ICheckoutForm {
	private deliveryData: IDeliveryData = { payment: '', address: '' };
	private contactData: IContactData = { email: '', phone: '' };

	/**
	 * Установить способ оплаты
	 * @param method - способ оплаты (наличные, карта и т.д.)
	 */
	setPaymentMethod(method: string) {
		this.deliveryData.payment = method;
	}

	/**
	 * Установить данные доставки (способ оплаты и адрес)
	 * @param data - данные доставки
	 */
	setDeliveryInfo(data: IDeliveryData): void {
		this.deliveryData = data;
	}

	/**
	 * Проверить корректность данных доставки
	 * Возвращает true, если заполнены и адрес, и способ оплаты
	 */
	validateDelivery(): boolean {
		return !!this.deliveryData.payment && !!this.deliveryData.address;
	}

	/**
	 * Установить контактные данные пользователя
	 * @param data - email и телефон
	 */
	setContactInfo(data: IContactData): void {
		this.contactData = data;
	}

	/**
	 * Проверить корректность контактных данных
	 * Возвращает true, если заполнены email и телефон
	 */
	validateContacts(): boolean {
		return !!this.contactData.email && !!this.contactData.phone;
	}

	/**
	 * Сформировать объект заказа для отправки на сервер
	 * Пока items и total устанавливаются пустыми,
	 * эти поля должны заполняться отдельно при оформлении
	 */
	composeOrder(): IOrder {
		return {
			payment: this.deliveryData.payment,
			address: this.deliveryData.address,
			email: this.contactData.email,
			phone: this.contactData.phone,
			items: [], // Добавляется при оформлении заказа из корзины
			total: 0, // Вычисляется отдельно по корзине
		};
	}
}
