/**
 * Класс для управления модальными окнами
 */
export class Popup {
	private modals: NodeListOf<HTMLElement>; // Все модальные окна на странице

	constructor() {
		// Получаем все модальные окна
		this.modals = document.querySelectorAll('.modal');

		// Назначаем обработчики для закрытия окон
		this.modals.forEach((modal) => {
			const closeBtn = modal.querySelector('.modal__close');
			closeBtn?.addEventListener('click', () => this.close(modal));

			modal.addEventListener('click', (event: MouseEvent) => {
				if (event.target === modal) this.close(modal); // Закрытие при клике вне контента
			});
		});
	}

	/** Открывает переданное модальное окно */
	open(modalElement: HTMLElement) {
		this.closeAll(); // Закрываем все другие окна
		modalElement.classList.add('modal_active'); // Показываем текущее
		this.lockScroll(); // Блокируем прокрутку страницы
	}

	/** Закрывает переданное модальное окно */
	close(modalElement: HTMLElement) {
		modalElement.classList.remove('modal_active'); // Скрываем
		this.unlockScroll(); // Возвращаем прокрутку
	}

	/** Закрывает все открытые модальные окна */
	closeAll() {
		this.modals.forEach((modal) => modal.classList.remove('modal_active'));
		this.unlockScroll();
	}

	/**
	 * Устанавливает текст в активном модальном окне
	 * (например, сообщение об успешном заказе)
	 */
	setText(text: string): void {
		this.modals.forEach((modal) => {
			if (modal.classList.contains('modal_active')) {
				const content = modal.querySelector('.modal__content');
				if (content) content.textContent = text;
			}
		});
	}

	/**
	 * Создаёт новое модальное окно с базовой структурой и
	 * назначает ему обработчики
	 */
	createModal(): HTMLElement {
		const modal = document.createElement('div');
		modal.classList.add('modal');
		modal.innerHTML = `
		<div class="modal__container">
		  <button class="modal__close" aria-label="закрыть"></button>
		  <div class="modal__content"></div>
		</div>
	  `;

		// Обработчик кнопки закрытия
		const closeBtn = modal.querySelector('.modal__close')!;
		closeBtn.addEventListener('click', () => this.close(modal));

		// Закрытие при клике вне области содержимого
		modal.addEventListener('click', (event: MouseEvent) => {
			if (event.target === modal) this.close(modal);
		});

		return modal;
	}

	/** Блокирует прокрутку фона при открытом модальном окне */
	private lockScroll() {
		const scrollY = window.scrollY || document.documentElement.scrollTop;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = '100%';
		document.body.dataset.scrollY = scrollY.toString(); // Сохраняем положение скролла
	}

	/** Возвращает прокрутку после закрытия модального окна */
	private unlockScroll() {
		const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.width = '';
		window.scrollTo(0, scrollY); // Возвращаем пользователя на прежнее место
		delete document.body.dataset.scrollY;
	}
}
