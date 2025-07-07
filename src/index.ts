import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import EventEmitter from 'events';

import { BasketModel } from './components/models/BasketModel';
import { CartStorage } from './components/models/CartStorage';
import { CatalogService } from './components/models/CatalogService';
import { CheckoutForm } from './components/models/CheckoutForm';
import { CurrentItem } from './components/models/CurrentItem';

import { CartView } from './components/views/CartView';
import { ProductCard } from './components/views/ProductCard';
import { ProductPreviewView } from './components/views/ProductPreviewView';
import { AddressFormView } from './components/views/AddressFormView';
import { ContactFormView } from './components/views/ContactFormView';
import { SuccessMessageView } from './components/views/SuccessMessageView';
import { Popup } from './components/views/Popup';
import { BasketView } from './components/views/BasketView';
import { OrderFormView } from './components/views/OrderView';
import { SuccessModalView } from './components/views/SuccessModalView';

import { AppEvents, IDeliveryDataEvent, IContactDataEvent } from './types';

// Получаем элементы DOM для работы с модальными окнами и интерфейсом
const container = document.querySelector('.page__wrapper') as HTMLElement;

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const productPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;

// Создаем объекты сервисов и моделей
const events = new EventEmitter();
const catalogService = new CatalogService(API_URL, CDN_URL);
const cartStorage = new CartStorage();
const cart = new BasketModel(cartStorage);

const checkoutForm = new CheckoutForm();
const currentItem = new CurrentItem();

const popup = new Popup();

// Создаем и добавляем модальные окна в контейнер
const orderModal = popup.createModal();
const basketModal = popup.createModal();

container.appendChild(orderModal);
container.appendChild(basketModal);

// Получаем контейнеры содержимого модальных окон
const orderModalContent = orderModal.querySelector(
	'.modal__content'
) as HTMLElement;
const basketModalContent = basketModal.querySelector(
	'.modal__content'
) as HTMLElement;

// Вставляем шаблоны в модальные окна
orderModalContent.appendChild(orderTemplate.content.cloneNode(true));
orderModalContent.appendChild(contactsTemplate.content.cloneNode(true));
orderModalContent.appendChild(successTemplate.content.cloneNode(true));
basketModalContent.appendChild(basketTemplate.content.cloneNode(true));

// Элементы для каталога и корзины
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
const cartCounterElement = document.querySelector(
	'.header__basket-counter'
) as HTMLElement;
const cartPriceElement = basketModal.querySelector(
	'.basket__price'
) as HTMLElement;
const basketListElement = basketModal.querySelector(
	'.basket__list'
) as HTMLElement;

const productPreviewModal = document.getElementById(
	'modal-container'
) as HTMLElement;
const successContainer = orderModal.querySelector(
	'.order-success'
) as HTMLElement;
const addressFormElement = orderModal.querySelector(
	'form[name="order"]'
) as HTMLFormElement;
const contactFormElement = orderModal.querySelector(
	'form[name="contacts"]'
) as HTMLFormElement;

// Создаем представления
const cartView = new CartView(cartCounterElement, cartPriceElement);
const addressFormView = new AddressFormView(addressFormElement, events);
const contactFormView = new ContactFormView(contactFormElement, events, popup);
const successMessageView = new SuccessMessageView(successContainer);
const basketView = new BasketView(
	basketModal,
	basketListElement,
	document.querySelector('#card-basket') as HTMLTemplateElement,
	cart,
	cartView,
	popup
);

// Обработчик открытия корзины по кнопке
const basketButton = document.querySelector('.header__basket') as HTMLElement;
basketButton.addEventListener('click', () => basketView.openBasket());

// Обработчик кнопки оформления заказа в корзине
basketModal.querySelector('.basket__button')?.addEventListener('click', () => {
	popup.close(basketModal);

	const orderModal = popup.createModal();
	const orderContent = orderModal.querySelector(
		'.modal__content'
	) as HTMLElement;
	orderContent.innerHTML = '';
	orderContent.appendChild(orderTemplate.content.cloneNode(true));
	container.appendChild(orderModal);
	popup.open(orderModal);

	const orderForm = orderModal.querySelector(
		'form[name="order"]'
	) as HTMLFormElement;
	new OrderFormView(orderForm, events, popup);

	// После выбора доставки открываем форму контактов
	events.once(AppEvents.DeliveryDataChanged, () => {
		const contactsModal = popup.createModal();
		const contactsContent = contactsModal.querySelector(
			'.modal__content'
		) as HTMLElement;
		contactsContent.innerHTML = '';
		contactsContent.appendChild(contactsTemplate.content.cloneNode(true));
		container.appendChild(contactsModal);
		popup.open(contactsModal);

		const contactForm = contactsModal.querySelector(
			'form[name="contacts"]'
		) as HTMLFormElement;
		new ContactFormView(contactForm, events, popup);

		// После заполнения контактов показываем успешное сообщение
		const successModalView = new SuccessModalView(container, popup, cart);

		events.once(AppEvents.ContactDataChanged, () => {
			successModalView.open();
			cartView.updateItemCount(0);
			cartView.updateTotalPrice(0);
		});
	});
});

// Загрузка каталога и рендер карточек товаров
catalogService
	.getProductList()
	.then((products) => {
		const template = document.querySelector(
			'#card-catalog'
		) as HTMLTemplateElement;

		products.forEach((product) => {
			const cardElement = template.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement;
			const productCard = new ProductCard(cardElement);
			productCard.render(product);

			cardElement.addEventListener('click', () => {
				currentItem.setActiveItem(product);
				const previewCard =
					productPreviewTemplate.content.firstElementChild!.cloneNode(
						true
					) as HTMLElement;
				const previewView = new ProductPreviewView(previewCard);
				previewView.render(product);

				const modalContent = productPreviewModal.querySelector(
					'.modal__content'
				) as HTMLElement;
				modalContent.innerHTML = '';
				modalContent.appendChild(previewCard);

				const addToCartButton = previewCard.querySelector('.card__button');
				if (addToCartButton) {
					addToCartButton.addEventListener('click', () => {
						if (currentItem.activeItem) {
							cart.addProduct(currentItem.activeItem);
							cartView.updateItemCount(cart.getTotalCount());
							cartView.updateTotalPrice(cart.calculateTotalPrice());
							popup.close(productPreviewModal);
						}
					});
				}

				popup.open(productPreviewModal);
			});

			catalogContainer.appendChild(cardElement);
		});
	})
	.catch((error) => {
		console.error('Ошибка загрузки каталога:', error);
		catalogContainer.innerHTML = '<p>Не удалось загрузить каталог</p>';
	});

// Обработчики событий обновления данных формы доставки и контактов
events.on(AppEvents.DeliveryDataChanged, (data: IDeliveryDataEvent) => {
	checkoutForm.setDeliveryInfo(data.deliveryData);
	addressFormView.setValid(checkoutForm.validateDelivery());
});

events.on(AppEvents.ContactDataChanged, (data: IContactDataEvent) => {
	checkoutForm.setContactInfo(data.contactData);
	contactFormView.setValid(checkoutForm.validateContacts());
});
