import './scss/styles.scss';



// Тип данных, приходящий с сервера
interface ApiProduct {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number;
  }
  
  // Тип данных для отображения карточки товара
interface ProductItem {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
    description: string;
    inCart: boolean;
  }
  
  // Тип данных в корзине
 interface CartItem {
    productId: string;
    title: string;
    price: number;
  }
  
  // Данные о заказе
  interface OrderPayment {
    address: string;
    paymentType: 'online' | 'cash';
  }
  
interface OrderContacts {
    email: string;
    phone: string;
  }
  
 interface ApiOrder {
    payment: OrderPayment;
    contacts: OrderContacts;
    items: string[]; // productId[]
  }
  
  // Интерфейс API клиента
  export interface IApiClient {
    getProducts(): Promise<ApiProduct[]>;
    sendOrder(order: ApiOrder): Promise<{ success: boolean }>;
  }
  
  // Интерфейс моделей
  export interface IProductModel {
    getProducts(): ProductItem[];
    toggleInCart(id: string): void;
  }
  
  export interface ICartModel {
    add(product: ProductItem): void;
    remove(productId: string): void;
    getItems(): CartItem[];
    clear(): void;
  }
  
  export interface IOrderModel {
    setPayment(data: OrderPayment): void;
    setContacts(data: OrderContacts): void;
    getFullOrder(): ApiOrder;
  }
  
  // Интерфейс отображения
  export interface IView<T> {
    render(data: T): void;
    clear(): void;
  }
  
  // Брокер событий
  export type AppEvent =
    | { type: 'product:add'; productId: string }
    | { type: 'product:remove'; productId: string }
    | { type: 'order:submit'; data: ApiOrder }
    | { type: 'modal:open'; productId: string }
    | { type: 'modal:close' };
  
  export interface IEventEmitter {
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    emit(event: string, payload?: unknown): void;
  }
  