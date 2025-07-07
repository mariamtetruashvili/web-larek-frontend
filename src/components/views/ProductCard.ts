/**
 * Класс для отображения карточки товара в каталоге
 * Реализует интерфейс IProductCardView
 */
import { IProduct } from '../../types';
import { IProductCardView } from '../../types';

export class ProductCard implements IProductCardView {
	private titleElement: HTMLElement; // Элемент заголовка товара
	private descriptionElement: HTMLElement | null; // Элемент описания товара (опционально)
	private priceElement: HTMLElement; // Элемент цены товара
	private categoryElement: HTMLElement; // Элемент категории товара
	private buttonElement: HTMLButtonElement; // Кнопка карточки

	/**
	 * @param container HTML-элемент карточки товара
	 */
	constructor(private container: HTMLElement) {
		this.titleElement = container.querySelector('.card__title')!;
		this.descriptionElement = container.querySelector('.card__text');
		this.priceElement = container.querySelector('.card__price')!;
		this.categoryElement = container.querySelector('.card__category')!;

		// Если контейнер сам является кнопкой
		if (container.tagName.toLowerCase() === 'button') {
			this.buttonElement = container as HTMLButtonElement;
		} else {
			// Иначе ищем кнопку внутри карточки
			const btn = container.querySelector('button');
			if (!btn) {
				throw new Error('Button element not found in ProductCard container');
			}
			this.buttonElement = btn;
		}
	}

	/** Устанавливает текст заголовка товара */
	setText(text: string): void {
		this.titleElement.textContent = text;
	}

	/** Устанавливает и форматирует цену товара */
	setFormattedPrice(price: number | null): void {
		this.priceElement.textContent = price ? `${price} синапсов` : 'Бесплатно';
	}

	/** Назначает CSS-класс для категории товара */
	setCategoryClass(category: string): void {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'card__category_soft',
			другое: 'card__category_other',
			'хард-скил': 'card__category_hard',
			книги: 'card__category_book',
			дополнительно: 'card__category_additional',
		};

		const className = categoryMap[category] || 'card__category_other';
		this.categoryElement.className = `card__category ${className}`;
	}

	/**
	 * Отображает данные товара в карточке
	 * @param product Объект товара из API
	 */
	render(product: IProduct): void {
		this.setText(product.title);
		this.setFormattedPrice(product.price);
		this.setCategoryClass(product.category);

		// Устанавливаем изображение товара
		const imageElement = this.container.querySelector('img');
		if (imageElement) {
			imageElement.src = product.image;
		}

		// Устанавливаем описание товара, если оно есть
		if (this.descriptionElement) {
			this.descriptionElement.textContent = product.description || '';
		}

		// Обновляем кнопку: клонируем и заменяем старую, чтобы снять предыдущие слушатели
		const newButton = this.buttonElement.cloneNode(true) as HTMLButtonElement;
		this.buttonElement.replaceWith(newButton);
		this.buttonElement = newButton;

		// Назначаем обработчик клика по кнопке
		this.buttonElement.addEventListener('click', () => {
			console.log(`Добавлен товар: ${product.title}`);
		});
	}
}
