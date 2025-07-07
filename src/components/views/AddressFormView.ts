import { IAddressFormView, AppEvents, IDeliveryData } from '../../types';
import { EventEmitter } from 'events';

/**
 * Класс для управления формой выбора доставки и способа оплаты
 */
export class AddressFormView implements IAddressFormView {
	protected form: HTMLFormElement;
	protected events: EventEmitter;

	constructor(form: HTMLFormElement, events: EventEmitter) {
		this.form = form;
		this.events = events;

		// Слушаем изменения в форме, чтобы отправлять данные о выборе доставки/оплаты
		this.form.addEventListener('input', () => {
			// Получаем выбранный способ оплаты (кнопка с классом .button_selected)
			const payment =
				this.form.querySelector('.button_selected')?.getAttribute('name') || '';
			// Получаем введённый адрес доставки
			const address = (
				this.form.elements.namedItem('address') as HTMLInputElement
			).value;

			// Генерируем событие изменения данных доставки
			this.events.emit(AppEvents.DeliveryDataChanged, {
				deliveryData: { payment, address },
			});
		});
	}

	/**
	 * Включение или отключение кнопки отправки формы в зависимости от валидности данных
	 */
	setValid(valid: boolean): void {
		const submit = this.form.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		submit.disabled = !valid;
	}

	/**
	 * Визуально выделить выбранный способ оплаты (подсветить кнопку)
	 */
	highlightPaymentMethod(method: string): void {
		const buttons = this.form.querySelectorAll('.order__buttons .button');
		buttons.forEach((btn) => {
			btn.classList.toggle(
				'button_selected',
				btn.getAttribute('name') === method
			);
		});
	}
}
