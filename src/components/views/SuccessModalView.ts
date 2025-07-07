/**
 * Класс для отображения модального окна с подтверждением успешного оформления заказа.
 */
import { Popup } from './Popup';
import { BasketModel } from '../models/BasketModel';

export class SuccessModalView {
	private container: HTMLElement; // Контейнер, в который добавляется модальное окно
	private popup: Popup; // Экземпляр класса для управления модальными окнами
	private cart: BasketModel; // Модель корзины для получения суммы и очистки

	/**
	 * @param container Контейнер для вставки модального окна
	 * @param popup Класс управления модалками
	 * @param cart Модель корзины
	 */
	constructor(container: HTMLElement, popup: Popup, cart: BasketModel) {
		this.container = container;
		this.popup = popup;
		this.cart = cart;
	}

	/**
	 * Открывает модальное окно успешного оформления заказа
	 */
	open(): void {
		const modal = this.createModal(); // Создаём модальное окно
		this.container.appendChild(modal); // Добавляем в DOM
		this.popup.open(modal); // Открываем окно

		const totalPrice = this.cart.calculateTotalPrice(); // Считаем сумму заказа
		const priceElem = modal.querySelector(
			'.order-success__description'
		) as HTMLElement;
		priceElem.textContent = `Списано ${totalPrice} синапсов`; // Выводим сумму списания

		this.cart.clearCart(); // Очищаем корзину

		// Кнопка закрытия модалки
		const closeBtn = modal.querySelector(
			'.order-success__close'
		) as HTMLButtonElement;
		closeBtn.addEventListener('click', () => {
			this.popup.close(modal);
			modal.remove();
		});
	}

	/**
	 * Создаёт новое модальное окно с шаблоном успешного заказа
	 * @returns Элемент модального окна
	 */
	private createModal(): HTMLElement {
		const modal = document.createElement('div');
		modal.classList.add('modal');
		modal.innerHTML = `
      <div class="modal__container">
        <button class="modal__close" aria-label="закрыть"></button>
        <div class="modal__content">
          ${document.querySelector('#success')?.innerHTML || ''}
        </div>
      </div>
    `;

		// Обработчик кнопки "X"
		modal.querySelector('.modal__close')?.addEventListener('click', () => {
			this.popup.close(modal);
			modal.remove();
		});

		// Закрытие при клике вне контента
		modal.addEventListener('click', (event: MouseEvent) => {
			if (event.target === modal) {
				this.popup.close(modal);
				modal.remove();
			}
		});

		return modal;
	}
}
