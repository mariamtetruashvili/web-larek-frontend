import { ICartStorage, IProduct } from '../../types';

/**
 * Класс для хранения и управления состоянием корзины товаров
 */
export class CartStorage implements ICartStorage {
	// Массив товаров в корзине
	private items: IProduct[] = [];

	/**
	 * Получить общее количество товаров в корзине
	 */
	getTotalCount(): number {
		return this.items.length;
	}

	/**
	 * Рассчитать итоговую сумму всех товаров в корзине
	 */
	calculateTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	/**
	 * Добавить товар в корзину
	 * @param product - товар для добавления
	 */
	addProduct(product: IProduct): void {
		this.items.push(product);
	}

	/**
	 * Удалить товар из корзины по id
	 * @param product - товар для удаления
	 */
	removeProduct(product: IProduct): void {
		this.items = this.items.filter((item) => item.id !== product.id);
	}

	/**
	 * Полностью очистить корзину
	 */
	clearCart(): void {
		this.items = [];
	}

	/**
	 * Получить копию массива товаров из корзины
	 */
	getItems(): IProduct[] {
		return [...this.items];
	}
}
