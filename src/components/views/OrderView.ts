import { AppEvents } from '../../types';
import { EventEmitter } from 'events';
import { Popup } from './Popup';

/**
 * Класс управления формой заказа (адрес и способ оплаты)
 */
export class OrderFormView {
	private form: HTMLFormElement; // Элемент формы заказа
	private submitButton: HTMLButtonElement; // Кнопка отправки формы
	private addressInput: HTMLInputElement; // Поле ввода адреса
	private paymentButtons: NodeListOf<HTMLButtonElement>; // Кнопки выбора способа оплаты
	private errorSpan: HTMLElement; // Элемент для отображения ошибок валидации
	private events: EventEmitter; // EventEmitter для генерации событий
	private popup: Popup; // Управление модальными окнами

	private selectedPayment: string = ''; // Выбранный способ оплаты

	constructor(form: HTMLFormElement, events: EventEmitter, popup: Popup) {
		this.form = form;
		this.events = events;
		this.popup = popup;

		this.submitButton = this.form.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		this.addressInput = this.form.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		this.paymentButtons = this.form.querySelectorAll('.order__buttons button');
		this.errorSpan = this.form.querySelector('.form__errors') as HTMLElement;

		// Слушатель изменения адреса для валидации
		this.addressInput.addEventListener('input', () => this.validate());

		// Слушатели кликов по кнопкам оплаты
		this.paymentButtons.forEach((btn) => {
			btn.addEventListener('click', () => {
				// Снимаем выделение со всех кнопок
				this.paymentButtons.forEach((b) =>
					b.classList.remove('button_alt-active')
				);
				// Выделяем выбранную кнопку
				btn.classList.add('button_alt-active');
				// Запоминаем выбранный способ оплаты
				this.selectedPayment = btn.getAttribute('name') || '';
				// Проверяем корректность формы
				this.validate();
			});
		});

		// Обработка отправки формы
		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (this.submitButton.disabled) return; // Если форма невалидна — ничего не делаем

			// Генерируем событие с данными доставки
			this.events.emit(AppEvents.DeliveryDataChanged, {
				deliveryData: {
					address: this.addressInput.value,
					payment: this.selectedPayment,
				},
			});

			// Закрываем и удаляем модальное окно
			this.popup.close(this.form.closest('.modal') as HTMLElement);
			this.form.closest('.modal')?.remove();
		});

		// Изначальная проверка валидации
		this.validate();
	}

	/**
	 * Проверяет валидность формы:
	 * - выбран способ оплаты
	 * - заполнен адрес
	 * Выводит ошибку и блокирует кнопку отправки при некорректных данных
	 */
	private validate(): void {
		this.errorSpan.textContent = '';
		if (!this.selectedPayment) {
			this.errorSpan.textContent = 'Выберите способ оплаты';
			this.submitButton.disabled = true;
			return;
		}
		if (!this.addressInput.value.trim()) {
			this.errorSpan.textContent = 'Необходимо указать адрес';
			this.submitButton.disabled = true;
			return;
		}
		this.submitButton.disabled = false;
	}
}
