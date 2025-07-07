/**
 * Класс для отображения детального представления товара в модальном окне.
 * Реализует интерфейс IProductPreviewView.
 */
import { IProduct, IProductPreviewView } from '../../types';

export class ProductPreviewView implements IProductPreviewView {
	private container: HTMLElement; // Контейнер карточки предпросмотра
	private titleElement: HTMLElement | null; // Заголовок товара
	private descriptionElement: HTMLElement | null; // Описание товара
	private priceElement: HTMLElement | null; // Элемент для отображения цены
	private categoryElement: HTMLElement | null; // Элемент категории
	private imageElement: HTMLImageElement | null; // Изображение товара
	private buttonElement: HTMLButtonElement | null; // Кнопка "добавить в корзину"

	/**
	 * @param container HTML-элемент модального окна предпросмотра
	 */
	constructor(container: HTMLElement) {
		this.container = container;
		this.titleElement = container.querySelector('.card__title');
		this.descriptionElement = container.querySelector('.card__text');
		this.priceElement = container.querySelector('.card__price');
		this.categoryElement = container.querySelector('.card__category');
		this.imageElement = container.querySelector('.card__image');
		this.buttonElement = container.querySelector('.card__button');
	}

	/** Устанавливает заголовок товара */
	setText(text: string): void {
		if (this.titleElement) {
			this.titleElement.textContent = text;
		}
	}

	/** Устанавливает и форматирует цену товара */
	setFormattedPrice(price: number | null): void {
		if (this.priceElement) {
			this.priceElement.textContent = price ? `${price} синапсов` : 'Бесплатно';
		}
	}

	/** Присваивает CSS-класс для отображения категории товара */
	setCategoryClass(category: string): void {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'card__category_soft',
			другое: 'card__category_other',
			'хард-скил': 'card__category_hard',
			книги: 'card__category_book',
			дополнительно: 'card__category_additional',
		};

		if (this.categoryElement) {
			const className = categoryMap[category] || 'card__category_other';
			this.categoryElement.className = `card__category ${className}`;
		}
	}

	/** Включает или отключает кнопку покупки в зависимости от доступности товара */
	toggleAvailability(isAvailable: boolean): void {
		if (this.buttonElement) {
			this.buttonElement.disabled = !isAvailable;
			this.buttonElement.classList.toggle('button_disabled', !isAvailable);
		}
	}

	/**
	 * Отображает данные товара в карточке предпросмотра
	 * @param product Объект товара
	 */
	render(product: IProduct): void {
		this.setText(product.title);
		this.setFormattedPrice(product.price);
		this.setCategoryClass(product.category);

		if (this.imageElement && product.image) {
			this.imageElement.src = product.image;
		}

		if (this.descriptionElement && product.description) {
			this.descriptionElement.textContent = product.description;
		}

		this.toggleAvailability(!!product.price);
	}
}
