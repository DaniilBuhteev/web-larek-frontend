import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { AppState, ProductItem } from './components/AppState';
import { BasketItem, Product, ProductPreview } from './components/Product';
import { IContactsForm, IOrder, IPaymentForm, IProduct } from './types';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { ContactsForm } from './components/ContactsForm';
import { PaymentForm } from './components/PaymentForm';
import { Success } from './components/Success';
import { EventEmitter } from './components/base/Events';
const events = new EventEmitter();
const api = new LarekApi(API_URL, CDN_URL);
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const appState = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketTemplate),
	events
);
const contacts = new ContactsForm(
	cloneTemplate<HTMLFormElement>(contactsTemplate),
	events
);
const paymentForm = new PaymentForm(
	cloneTemplate<HTMLFormElement>(paymentTemplate),
	events
);
events.on('catalog:painted', () => {
	page.catalog = appState.catalog.map((item) => {
		const product = new Product(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('product:select', item),
		});
		return product.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});
events.on('product:select', (item: ProductItem) => {
	appState.setPreview(item);
});
events.on('product:select', (item: IProduct) => {
	const productPreview = new ProductPreview(
		cloneTemplate(cardPreviewTemplate),
		{
			onClick: () => events.emit('basket:add', item),
		}
	);
	modal.render({
		content: productPreview.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});
	if (item.price === null) {
		productPreview.setDisabled(productPreview.buttonElement, true);
		productPreview.buttonElement.textContent = 'Не продается';
	}
	if (appState.basket.includes(item)) {
		productPreview.setDisabled(productPreview.buttonElement, true);
		productPreview.buttonElement.textContent = 'Товар в коризне';
	}
});
events.on('basket:change', () => {
	page.catalog = appState.catalog.map((item) => {
		const product = new Product(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('product:select', item),
		});
		return product.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
	page.counter = appState.basket.length;
});
events.on('basket:add', (item: IProduct) => {
	appState.addProductBasket(item);
	modal.close();
});
events.on('basket:remove', (item: IProduct) => {
	appState.removeProductBasket(item);
});
events.on('basket:open', () => {
	basket.total = appState.getTotal();
	appState.clearOrderField();
	let i = 1;
	basket.items = appState.basket.map((item) => {
		const product = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove', item),
		});
		return product.render({
			title: item.title,
			price: item.price,
			index: i++,
		});
	});
	modal.render({
		content: basket.render(),
	});
});
events.on('order:submit', () => {
	appState.order.total = appState.getTotal();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});
events.on('payment:open', () => {
	modal.render({
		content: paymentForm.render({
			address: '',
			payment: 'online',
			valid: false,
			errors: [],
		}),
	});
});
events.on('contacts:submit', () => {
	api
		.orderResult(appState.order)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					total: res.total,
				}),
			});
			appState.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});
events.on('modal:open', () => {
	page.locked = true;
});
events.on('modal:close', () => {
	page.locked = false;
});
events.on('payment:change', (item: HTMLButtonElement) => {
	appState.order.payment = item.name;
	appState.validateOrder();
});
events.on(
	/(^order|^contacts)\..*:change/,
	(data: {
		field: keyof IContactsForm | keyof IPaymentForm;
		value: string;
	}) => {
		appState.setOrderField(data.field, data.value);
	}
);
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, payment, address } = errors;
	contacts.valid = !email && !phone;
	paymentForm.valid = !payment && !address;
	contacts.errors = Object.values({
		phone,
		email,
	})
		.filter((i) => !!i)
		.join('; ');
	paymentForm.errors = Object.values({
		payment,
		address,
	})
		.filter((i) => !!i)
		.join('; ');
});
api
	.getProductList()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.error(err);
	});
