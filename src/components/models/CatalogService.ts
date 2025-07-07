import { Api } from '../base/api';
import { IProduct, IOrder } from '../../types';

/**
 * Сервис для работы с каталогом товаров и заказами через API
 */
export class CatalogService extends Api {
	public cdn: string;

	/**
	 * @param baseUrl - базовый URL API
	 * @param cdnUrl - URL CDN для загрузки изображений товаров
	 */
	constructor(baseUrl: string, cdnUrl: string) {
		super(baseUrl);
		this.cdn = cdnUrl;
	}

	/**
	 * Получить список товаров из каталога
	 * Выполняет запрос к /product, ожидает объект с полем items,
	 * добавляет к пути изображения префикс CDN
	 */
	async getProductList(): Promise<IProduct[]> {
		const data = (await this.get('/product')) as { items: IProduct[] };
		return data.items.map((item) => ({
			...item,
			image: this.cdn + item.image, // добавляем префикс CDN к изображению
		}));
	}

	/**
	 * Отправить заказ на сервер
	 * @param order - объект заказа
	 */
	async submitOrder(order: IOrder): Promise<void> {
		await this.post('/order', order);
	}
}
