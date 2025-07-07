import { IProduct, IProductPreviewView } from '../../types';
import { BasketModel } from '../models/BasketModel';
import { CartView } from './CartView';
import { Popup } from './Popup';

/**
 * Класс для отображения превью товара в модальном окне
 * Отвечает за рендер данных продукта, управление кнопкой "Добавить в корзину"
 */
export class ProductPreviewView implements IProductPreviewView {
	private container: HTMLElement; // Контейнер с разметкой превью
	private titleElement: HTMLElement | null; // Элемент заголовка товара
	private descriptionElement: HTMLElement | null; // Элемент описания товара
	private priceElement: HTMLElement | null; // Элемент с ценой
	private categoryElement: HTMLElement | null; // Элемент с категорией товара
	private imageElement: HTMLImageElement | null; // Элемент с изображением товара
	private buttonElement: HTMLButtonElement | null; // Кнопка добавления товара в корзину
	private popup: Popup; // Управление модальными окнами
	private cart: BasketModel; // Модель корзины для добавления товара
	private cartView: CartView; // Представление корзины для обновления UI
	private modalContainer: HTMLElement; // Контейнер модального окна

	constructor(
		container: HTMLElement,
		popup: Popup,
		cart: BasketModel,
		cartView: CartView,
		modalContainer: HTMLElement
	) {
		this.container = container;

		// Инициализируем элементы внутри контейнера по классам
		this.titleElement = container.querySelector('.card__title');
		this.descriptionElement = container.querySelector('.card__text');
		this.priceElement = container.querySelector('.card__price');
		this.categoryElement = container.querySelector('.card__category');
		this.imageElement = container.querySelector('.card__image');
		this.buttonElement = container.querySelector('.card__button');

		this.popup = popup;
		this.cart = cart;
		this.cartView = cartView;
		this.modalContainer = modalContainer;
	}

	/** Установить заголовок товара */
	setText(text: string): void {
		if (this.titleElement) {
			this.titleElement.textContent = text;
		}
	}

	/** Отобразить цену с форматированием (в синапсах или "Бесплатно") */
	setFormattedPrice(price: number | null): void {
		if (this.priceElement) {
			this.priceElement.textContent = price ? `${price} синапсов` : 'Бесплатно';
		}
	}

	/** Добавить CSS класс категории товара для стилизации */
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

	/** Включить/выключить доступность кнопки "Добавить в корзину" */
	toggleAvailability(isAvailable: boolean): void {
		if (this.buttonElement) {
			this.buttonElement.disabled = !isAvailable;
			this.buttonElement.classList.toggle('button_disabled', !isAvailable);
		}
	}

	/**
	 * Основной метод отрисовки товара в превью
	 * @param product - объект продукта для отображения
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

		// Обновляем кнопку, чтобы сбросить предыдущие обработчики событий
		if (this.buttonElement) {
			this.buttonElement.replaceWith(this.buttonElement.cloneNode(true));
			this.buttonElement = this.container.querySelector('.card__button');

			// Добавляем обработчик добавления товара в корзину по клику
			this.buttonElement?.addEventListener('click', () => {
				this.cart.addProduct(product);
				this.cartView.updateItemCount(this.cart.getTotalCount());
				this.cartView.updateTotalPrice(this.cart.calculateTotalPrice());
				this.popup.close(this.modalContainer); // Закрываем модальное окно
			});
		}
	}
}
