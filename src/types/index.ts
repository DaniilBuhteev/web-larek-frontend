import './scss/styles.scss';
export type TCategory =
	| 'soft-skill'
	| 'hard-skill'
	| 'additional'
	| 'button'
	| 'other';
export type FormErrors = Partial<Record<keyof IOrder, string>>;
export interface IProduct {
	id: string;
	title: string;
	description: string;
	price: number | null;
	category: TCategory;
	image: string;
	index: number;
}
export interface IPaymentForm {
	payment: string;
	address: string;
}
export interface IContactsForm {
	email: string;
	phone: string;
}
export interface IPage {
	products: IProduct[];
	counter: number;
}
export interface IBasket {
	products: IProduct[];
	priceAll: number;
}
export interface IOrder extends IPaymentForm, IContactsForm {
	total: number | string;
	items: string[];
}
export interface ISuccess {
	total: number;
	id: string;
}
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
}
export interface IModalData {
	content: HTMLElement;
}
export interface IFormState {
	valid: boolean;
	errors: string[];
}
export interface IActions {
	onClick: () => void;
}
