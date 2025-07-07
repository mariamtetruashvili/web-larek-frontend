import { BasketModel } from '../models/BasketModel';
import { Popup } from './Popup';
import { CartView } from './CartView';
import EventEmitter from 'events';
import { AppEvents } from '../../types';

/**
 * Класс для управления отображением корзины в виде модального окна
 * Отвечает за рендеринг товаров, обработку удаления и запуск оформления заказа
 */
export class BasketView {
	private basketModal: HTMLElement; // Модальное окно корзины
	private basketListElement: HTMLElement; // Контейнер списка товаров в корзине
	private basketTemplate: HTMLTemplateElement; // Шаблон отдельного товара в корзине
	private cartView: CartView; // Представление корзины (счётчик и сумма)
	private popup: Popup; // Управление модальными окнами
	private basketModel: BasketModel; // Модель корзины (данные товаров)
	private events: EventEmitter; // Система событий для связи с другими частями приложения

	constructor(
		basketModal: HTMLElement,
		basketListElement: HTMLElement,
		basketTemplate: HTMLTemplateElement,
		basketModel: BasketModel,
		cartView: CartView,
		popup: Popup,
		events: EventEmitter
	) {
		// Инициализация свойств класса
		this.basketModal = basketModal;
		this.basketListElement = basketListElement;
		this.basketTemplate = basketTemplate;
		this.basketModel = basketModel;
		this.cartView = cartView;
		this.popup = popup;
		this.events = events;

		// Настраиваем обработчик кнопки "Оформить заказ"
		this.setupOrderButton();
	}

	/**
	 * Открыть модальное окно корзины и отрисовать текущие товары из модели
	 */
	openBasket() {
		this.renderItems(); // Отрисовать товары
		this.popup.open(this.basketModal); // Открыть модальное окно корзины
	}

	/**
	 * Настроить обработчик клика по кнопке оформления заказа
	 * При клике будет вызвано событие начала оформления заказа
	 */
	private setupOrderButton() {
		const checkoutBtn = this.basketModal.querySelector(
			'.basket__button'
		) as HTMLButtonElement;
		if (checkoutBtn) {
			checkoutBtn.addEventListener('click', () => {
				this.events.emit(AppEvents.OrderStarted); // Сигнал о начале оформления заказа (MVP)
			});
		}
	}

	/**
	 * Отрисовать список товаров в корзине
	 * Для каждого товара клонируется шаблон, заполняется данными, добавляется обработчик удаления
	 */
	private renderItems() {
		this.basketListElement.innerHTML = ''; // Очищаем текущий список
		const items = this.basketModel.getItems(); // Получаем товары из модели
		const itemTemplate = this.basketTemplate;

		if (!itemTemplate.content.firstElementChild) {
			console.error('Basket template is empty');
			return;
		}

		items.forEach((item, index) => {
			// Клонируем шаблон для одного товара
			const itemElement = itemTemplate.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement;

			// Получаем элементы внутри шаблона для заполнения
			const indexElement = itemElement.querySelector('.basket__item-index');
			const titleElement = itemElement.querySelector('.card__title');
			const priceElement = itemElement.querySelector('.card__price');
			const deleteBtn = itemElement.querySelector('.basket__item-delete');

			// Проверка на корректность шаблона
			if (!indexElement || !titleElement || !priceElement || !deleteBtn) {
				console.error('One or more basket item elements not found in template');
				return;
			}

			// Заполняем шаблон данными товара
			indexElement.textContent = `${index + 1}`; // Номер товара в списке
			titleElement.textContent = item.title; // Название товара
			priceElement.textContent = `${item.price} синапсов`; // Цена товара (синапсы — условная валюта)

			// Обработчик удаления товара из корзины
			deleteBtn.addEventListener('click', () => {
				this.basketModel.removeProduct(item); // Удаляем товар из модели
				this.cartView.updateItemCount(this.basketModel.getTotalCount()); // Обновляем счётчик товаров
				this.cartView.updateTotalPrice(this.basketModel.calculateTotalPrice()); // Обновляем общую цену
				itemElement.remove(); // Удаляем элемент из DOM
				this.updateCheckoutButtonState(); // Обновляем состояние кнопки "Оформить заказ"
			});

			// Добавляем заполненный элемент в список корзины
			this.basketListElement.appendChild(itemElement);
		});

		// Обновляем итоговую сумму и кнопку оформления
		this.cartView.updateTotalPrice(this.basketModel.calculateTotalPrice());
		this.updateCheckoutButtonState();
	}

	/**
	 * Включить или отключить кнопку оформления заказа в зависимости от наличия товаров в корзине
	 */
	private updateCheckoutButtonState() {
		const checkoutBtn = this.basketModal.querySelector(
			'.basket__button'
		) as HTMLButtonElement;
		if (this.basketModel.getItems().length === 0) {
			checkoutBtn.setAttribute('disabled', 'true'); // Отключить кнопку если корзина пуста
		} else {
			checkoutBtn.removeAttribute('disabled'); // Включить кнопку если есть товары
		}
	}
}
