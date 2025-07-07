/**
 * Класс для отображения сообщения об успешном оформлении заказа.
 * Реализует интерфейс ISuccessMessageView.
 */
import { ISuccessMessageView } from '../../types';

export class SuccessMessageView implements ISuccessMessageView {
	private messageElement: HTMLElement; // Элемент, в котором отображается текст подтверждения

	/**
	 * @param container Контейнер, содержащий элемент с сообщением
	 */
	constructor(private container: HTMLElement) {
		// Ищем элемент, в который будет вставляться текст подтверждения
		this.messageElement = container.querySelector(
			'.order-success__description'
		)!;
	}

	/**
	 * Устанавливает текст подтверждения успешного заказа
	 * @param text Текст для отображения
	 */
	setConfirmationText(text: string): void {
		this.messageElement.textContent = text;
	}
}
