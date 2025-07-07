// Импорт глобальных стилей
import './scss/styles.scss';

// Импорт констант и внешних библиотек
import { API_URL, CDN_URL } from './utils/constants';
import EventEmitter from 'events';

// Импорт моделей и сервисов для работы с данными
import { BasketModel } from './components/models/BasketModel';
import { CartStorage } from './components/models/CartStorage';
import { CatalogService } from './components/models/CatalogService';
import { CheckoutForm } from './components/models/CheckoutForm';
import { CurrentItem } from './components/models/CurrentItem';

// Импорт представлений (View) для управления UI и взаимодействием
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

// Импорт типов и событий для системы событий
import { AppEvents, IDeliveryDataEvent, IContactDataEvent } from './types';

// Получение элементов DOM, необходимых для работы с модальными окнами и основным интерфейсом
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

// Создание экземпляров сервисов и моделей для работы с данными и хранилищем
const events = new EventEmitter();
const catalogService = new CatalogService(API_URL, CDN_URL);
const cartStorage = new CartStorage();
const cart = new BasketModel(cartStorage);

const checkoutForm = new CheckoutForm();
const currentItem = new CurrentItem();

const popup = new Popup();

// Создание и добавление модальных окон в DOM
const orderModal = popup.createModal();
const basketModal = popup.createModal();

container.appendChild(orderModal);
container.appendChild(basketModal);

// Получение контейнеров для содержимого модальных окон
const orderModalContent = orderModal.querySelector(
	'.modal__content'
) as HTMLElement;
const basketModalContent = basketModal.querySelector(
	'.modal__content'
) as HTMLElement;

// Вставка шаблонов в соответствующие модальные окна
orderModalContent.appendChild(orderTemplate.content.cloneNode(true));
orderModalContent.appendChild(contactsTemplate.content.cloneNode(true));
orderModalContent.appendChild(successTemplate.content.cloneNode(true));
basketModalContent.appendChild(basketTemplate.content.cloneNode(true));

// Элементы интерфейса для каталога и корзины
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

// Создание представлений для управления отображением и взаимодействием
const cartView = new CartView(cartCounterElement, cartPriceElement);
const addressFormView = new AddressFormView(addressFormElement, events);
const contactFormView = new ContactFormView(contactFormElement, events, popup);
const successMessageView = new SuccessMessageView(successContainer);

// Создание BasketView для управления корзиной в модальном окне
const basketView = new BasketView(
	basketModal,
	basketListElement,
	document.querySelector('#card-basket') as HTMLTemplateElement,
	cart,
	cartView,
	popup,
	events // Передаем EventEmitter для обработки событий
);

// Кнопка для открытия корзины - навешиваем обработчик клика
const basketButton = document.querySelector('.header__basket') as HTMLElement;
basketButton.addEventListener('click', () => basketView.openBasket());

// MVP: обработка события начала оформления заказа
events.on(AppEvents.OrderStarted, () => {
	popup.close(basketModal);

	// Создаем модальное окно оформления заказа и добавляем в DOM
	const orderModal = popup.createModal();
	const orderContent = orderModal.querySelector(
		'.modal__content'
	) as HTMLElement;
	orderContent.innerHTML = '';
	orderContent.appendChild(orderTemplate.content.cloneNode(true));
	container.appendChild(orderModal);
	popup.open(orderModal);

	// Инициализация формы заказа и её обработчиков
	const orderForm = orderModal.querySelector(
		'form[name="order"]'
	) as HTMLFormElement;
	new OrderFormView(orderForm, events, popup);

	// Обработка изменения данных доставки
	events.once(AppEvents.DeliveryDataChanged, () => {
		// Создаем модальное окно для контактных данных
		const contactsModal = popup.createModal();
		const contactsContent = contactsModal.querySelector(
			'.modal__content'
		) as HTMLElement;
		contactsContent.innerHTML = '';
		contactsContent.appendChild(contactsTemplate.content.cloneNode(true));
		container.appendChild(contactsModal);
		popup.open(contactsModal);

		// Инициализация формы контактных данных и её обработчиков
		const contactForm = contactsModal.querySelector(
			'form[name="contacts"]'
		) as HTMLFormElement;
		new ContactFormView(contactForm, events, popup);

		// Открытие окна успешного оформления после заполнения контактов
		const successModalView = new SuccessModalView(container, popup, cart);
		events.once(AppEvents.ContactDataChanged, () => {
			successModalView.open();
			cartView.updateItemCount(0);
			cartView.updateTotalPrice(0);
		});
	});
});

// Загрузка каталога товаров с сервера и отрисовка карточек
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

			// Открытие превью товара по клику на карточку
			cardElement.addEventListener('click', () => {
				currentItem.setActiveItem(product);

				const previewCard =
					productPreviewTemplate.content.firstElementChild!.cloneNode(
						true
					) as HTMLElement;
				const previewView = new ProductPreviewView(
					previewCard,
					popup,
					cart,
					cartView,
					productPreviewModal
				);

				previewView.render(product);

				const modalContent = productPreviewModal.querySelector(
					'.modal__content'
				) as HTMLElement;
				modalContent.innerHTML = '';
				modalContent.appendChild(previewCard);

				popup.open(productPreviewModal);
			});

			// Добавляем карточку товара в контейнер каталога
			catalogContainer.appendChild(cardElement);
		});
	})
	.catch((error) => {
		console.error('Ошибка загрузки каталога:', error);
		catalogContainer.innerHTML = '<p>Не удалось загрузить каталог</p>';
	});

// Обработчики событий обновления данных формы доставки и контактов
events.on(AppEvents.DeliveryDataChanged, (data: IDeliveryDataEvent) => {
	// Обновляем данные доставки и валидацию формы
	checkoutForm.setDeliveryInfo(data.deliveryData);
	addressFormView.setValid(checkoutForm.validateDelivery());
});

events.on(AppEvents.ContactDataChanged, (data: IContactDataEvent) => {
	// Обновляем контактные данные и валидацию формы
	checkoutForm.setContactInfo(data.contactData);
	contactFormView.setValid(checkoutForm.validateContacts());
});
