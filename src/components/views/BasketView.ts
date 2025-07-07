import { BasketModel } from '../models/BasketModel';
import { Popup } from './Popup';
import { CartView } from './CartView';

/**
 * Класс для управления отображением корзины (модальное окно)
 */
export class BasketView {
	private basketModal: HTMLElement;
	private basketListElement: HTMLElement;
	private basketTemplate: HTMLTemplateElement;
	private cartView: CartView;
	private popup: Popup;
	private basketModel: BasketModel;

	constructor(
		basketModal: HTMLElement,
		basketListElement: HTMLElement,
		basketTemplate: HTMLTemplateElement,
		basketModel: BasketModel,
		cartView: CartView,
		popup: Popup
	) {
		this.basketModal = basketModal;
		this.basketListElement = basketListElement;
		this.basketTemplate = basketTemplate;
		this.basketModel = basketModel;
		this.cartView = cartView;
		this.popup = popup;
	}

	/**
	 * Открыть модальное окно корзины и отрисовать текущие товары
	 */
	openBasket() {
		this.renderItems();
		this.popup.open(this.basketModal);
	}

	/**
	 * Отрисовка списка товаров в корзине
	 */
	private renderItems() {
		this.basketListElement.innerHTML = '';
		const items = this.basketModel.getItems();
		const itemTemplate = this.basketTemplate;

		// Проверяем, что шаблон содержит элементы
		if (!itemTemplate.content.firstElementChild) {
			console.error('Basket template is empty');
			return;
		}

		items.forEach((item, index) => {
			// Клонируем шаблон для каждого товара
			const itemElement = itemTemplate.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement;

			// Находим необходимые элементы внутри клона шаблона
			const indexElement = itemElement.querySelector('.basket__item-index');
			const titleElement = itemElement.querySelector('.card__title');
			const priceElement = itemElement.querySelector('.card__price');
			const deleteBtn = itemElement.querySelector('.basket__item-delete');

			if (!indexElement || !titleElement || !priceElement || !deleteBtn) {
				console.error('One or more basket item elements not found in template');
				return;
			}

			// Заполняем данные товара
			indexElement.textContent = `${index + 1}`; // Позиция товара в списке
			titleElement.textContent = item.title; // Название товара
			priceElement.textContent = `${item.price} синапсов`; // Цена товара с единицами

			// Добавляем обработчик удаления товара из корзины
			deleteBtn.addEventListener('click', () => {
				this.basketModel.removeProduct(item); // Удаляем товар из модели корзины
				this.cartView.updateItemCount(this.basketModel.getTotalCount()); // Обновляем счетчик в UI
				this.cartView.updateTotalPrice(this.basketModel.calculateTotalPrice()); // Обновляем сумму
				itemElement.remove(); // Удаляем элемент из DOM
				this.updateCheckoutButtonState(); // Обновляем состояние кнопки оформления
			});

			// Добавляем элемент товара в список в корзине
			this.basketListElement.appendChild(itemElement);
		});

		// Обновляем итоговую цену в корзине
		this.cartView.updateTotalPrice(this.basketModel.calculateTotalPrice());
		this.updateCheckoutButtonState();
	}

	/**
	 * Включение/отключение кнопки оформления заказа
	 * в зависимости от наличия товаров в корзине
	 */
	private updateCheckoutButtonState() {
		const checkoutBtn = this.basketModal.querySelector(
			'.basket__button'
		) as HTMLButtonElement;
		if (this.basketModel.getItems().length === 0) {
			checkoutBtn.setAttribute('disabled', 'true');
		} else {
			checkoutBtn.removeAttribute('disabled');
		}
	}
}
