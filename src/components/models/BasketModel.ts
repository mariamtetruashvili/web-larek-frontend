import { CartStorage } from './CartStorage';

/**
 * Модель корзины покупок
 * Оборачивает работу с CartStorage и предоставляет методы управления корзиной
 */
export class BasketModel {
	private cart: CartStorage;

	constructor(cart: CartStorage) {
		this.cart = cart;
	}

	/** Получить список товаров из корзины */
	getItems() {
		return this.cart.getItems();
	}

	/** Добавить товар в корзину */
	addProduct(product: any) {
		this.cart.addProduct(product);
	}

	/** Удалить товар из корзины */
	removeProduct(product: any) {
		this.cart.removeProduct(product);
	}

	/** Получить общее количество товаров в корзине */
	getTotalCount() {
		return this.cart.getTotalCount();
	}

	/** Рассчитать итоговую сумму корзины */
	calculateTotalPrice() {
		return this.cart.calculateTotalPrice();
	}

	/** Очистить корзину */
	clearCart() {
		this.cart.clearCart();
	}
}
