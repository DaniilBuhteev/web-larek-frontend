import {
	FormErrors,
	IAppState,
	IContactsForm,
	IOrder,
	IPaymentForm,
	IProduct,
	TCategory,
} from '../types';
import { Product } from './Product';
import { Model } from './base/Model';
export class ProductItem extends Model<IProduct> {
	id: string;
	title: string;
	description: string;
	price: number | null;
	category: TCategory;
	image: string;
}
export class AppState extends Model<IAppState> {
	catalog: ProductItem[] = [];
	order: IOrder = {
		email: '',
		phone: '',
		total: 0,
		address: '',
		items: [],
		payment: '',
	};
	basket: IProduct[] = [];
	formErrors: FormErrors = {};
	preview: string | null;
	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('catalog:painted', {
			catalog: this.catalog,
		});
	}
	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:open', item);
	}
	setTotal(value: number | string) {
		this.order.total = value;
	}
	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}
	addProductBasket(item: IProduct) {
		this.basket.push(item);
		this.order.items.push(item.id);
		this.emitChanges('basket:change');
	}
	removeProductBasket(item: IProduct) {
		const indexBasket = this.basket.indexOf(item);
		this.basket.splice(indexBasket, 1);
		const indexOrder = this.order.items.indexOf(item.id);
		this.order.items.splice(indexOrder, 1);
		this.emitChanges('basket:open');
		this.emitChanges('basket:change');
	}
	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}
	setOrderField(
		field: keyof IContactsForm | keyof IPaymentForm,
		value: string
	) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:filled', this.order);
		}
	}
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrderField() {
		this.order.address = '';
		this.order.email = '';
		this.order.phone = '';
		this.order.payment = '';
	}
}
