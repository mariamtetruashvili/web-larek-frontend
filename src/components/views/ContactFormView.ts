import { IContactFormView, AppEvents, IContactData } from '../../types';
import { EventEmitter } from 'events';
import { Popup } from './Popup';

/**
 * Класс для управления формой ввода контактных данных (email и телефон)
 * Отвечает за валидацию, отправку данных и управление состоянием кнопки submit
 */
export class ContactFormView implements IContactFormView {
	protected form: HTMLFormElement; // Элемент формы контактов
	protected events: EventEmitter; // Система событий для уведомления других компонентов
	popup: Popup; // Класс для управления модальными окнами

	constructor(form: HTMLFormElement, events: EventEmitter, popup: Popup) {
		this.form = form;
		this.events = events;
		this.popup = popup;

		// Получаем элементы формы по имени
		const emailInput = this.form.elements.namedItem(
			'email'
		) as HTMLInputElement;
		const phoneInput = this.form.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		const submitButton = this.form.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;

		// Функция валидации: проверяет корректность email и заполненность телефона
		const validate = () => {
			const emailValid =
				emailInput.value.trim() !== '' && /\S+@\S+\.\S+/.test(emailInput.value);
			const phoneValid = phoneInput.value.trim() !== '';
			submitButton.disabled = !(emailValid && phoneValid); // Кнопка активна только если оба поля валидны
		};

		// Подписка на ввод в поля для динамической валидации
		emailInput.addEventListener('input', validate);
		phoneInput.addEventListener('input', validate);

		// Начальная проверка валидности при создании формы
		validate();

		// Обработчик отправки формы
		this.form.addEventListener('submit', (e) => {
			e.preventDefault();

			// Если кнопка отключена, прерываем отправку
			if (submitButton.disabled) return;

			// Генерируем событие с данными контактов для внешних слушателей
			this.events.emit(AppEvents.ContactDataChanged, {
				contactData: {
					email: emailInput.value,
					phone: phoneInput.value,
				},
			});

			// Закрываем и удаляем модальное окно с формой
			this.popup.close(this.form.closest('.modal') as HTMLElement);
			this.form.closest('.modal')?.remove();
		});
	}

	/**
	 * Управление доступностью кнопки submit извне
	 * @param valid - если true, кнопка активна, иначе отключена
	 */
	setValid(valid: boolean): void {
		const button = this.form.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;
		button.disabled = !valid;
	}

	// Сеттер для установки email в поле формы
	set email(email: string) {
		(this.form.elements.namedItem('email') as HTMLInputElement).value = email;
	}

	// Сеттер для установки телефона в поле формы
	set phone(phone: string) {
		(this.form.elements.namedItem('phone') as HTMLInputElement).value = phone;
	}
}
