import { ICartView } from '../../types';

/**
 * Класс для отображения количества товаров и общей суммы в корзине
 */
export class CartView implements ICartView {
	protected counter: HTMLElement; // Элемент счетчика товаров в корзине
	protected price: HTMLElement; // Элемент отображения общей суммы

	constructor(counter: HTMLElement, price: HTMLElement) {
		this.counter = counter;
		this.price = price;
	}

	/**
	 * Обновляет отображение количества товаров в корзине
	 * @param count - новое количество товаров
	 */
	updateItemCount(count: number): void {
		this.counter.textContent = String(count);
	}

	/**
	 * Обновляет отображение общей суммы заказа
	 * @param price - итоговая сумма
	 */
	updateTotalPrice(price: number): void {
		this.price.textContent = `${price} синапсов`;
	}
}
