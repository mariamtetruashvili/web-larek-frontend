import { ICurrentItem, IProduct } from '../../types';

/**
 * Класс для хранения и управления текущим выбранным товаром
 */
export class CurrentItem implements ICurrentItem {
	// Текущий выбранный товар, по умолчанию null
	activeItem: IProduct | null = null;

	// Метод для установки активного товара
	setActiveItem(product: IProduct): void {
		this.activeItem = product;
	}
}
