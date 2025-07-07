import { IContactFormView, AppEvents, IContactData } from '../../types';
import { EventEmitter } from 'events';
import { Popup } from './Popup';

/**
 * Класс для управления формой ввода контактных данных (email, телефон)
 */
export class ContactFormView implements IContactFormView {
	protected form: HTMLFormElement; // Элемент формы
	protected events: EventEmitter; // EventEmitter для генерации событий
	popup: Popup; // Экземпляр Popup для управления модальными окнами

	constructor(form: HTMLFormElement, events: EventEmitter, popup: Popup) {
		this.form = form;
		this.events = events;
		this.popup = popup;

		const emailInput = this.form.elements.namedItem(
			'email'
		) as HTMLInputElement;
		const phoneInput = this.form.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		const submitButton = this.form.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;

		// Функция валидации формы
		const validate = () => {
			const emailValid =
				emailInput.value.trim() !== '' && /\S+@\S+\.\S+/.test(emailInput.value);
			const phoneValid = phoneInput.value.trim() !== '';
			submitButton.disabled = !(emailValid && phoneValid);
		};

		// Слушатели ввода для валидации в реальном времени
		emailInput.addEventListener('input', validate);
		phoneInput.addEventListener('input', validate);

		// Начальная валидация при создании экземпляра
		validate();

		// Обработка отправки формы
		this.form.addEventListener('submit', (e) => {
			e.preventDefault();

			if (submitButton.disabled) return;

			// Генерируем событие изменения контактных данных
			this.events.emit(AppEvents.ContactDataChanged, {
				contactData: {
					email: emailInput.value,
					phone: phoneInput.value,
				},
			});

			// Закрываем модальное окно и удаляем его из DOM
			this.popup.close(this.form.closest('.modal') as HTMLElement);
			this.form.closest('.modal')?.remove();
		});
	}

	// Метод для управления доступностью кнопки submit
	setValid(valid: boolean): void {
		const button = this.form.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;
		button.disabled = !valid;
	}

	// Установить email в форму
	setEmail(email: string): void {
		(this.form.elements.namedItem('email') as HTMLInputElement).value = email;
	}

	// Установить телефон в форму
	setPhone(phone: string): void {
		(this.form.elements.namedItem('phone') as HTMLInputElement).value = phone;
	}
}
