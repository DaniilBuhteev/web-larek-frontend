import {
	Component
} from "./base/Component";
import {
	IActions,
	IProduct
} from "../types";
import {
	ensureElement
} from "../utils/utils";
export class Product extends Component < IProduct > {
	protected _id: string;
	protected _title: HTMLElement;
	protected _description: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button: HTMLButtonElement;
	protected _categoryColors = < Record < string,
	string >> {
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};
	constructor(container: HTMLElement, actions ? : IActions) {
		super(container);
		this._title = ensureElement < HTMLElement > (`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._description = container.querySelector('card__description');
		this._price = ensureElement < HTMLImageElement > (`.card__price`, container);
		this._category = container.querySelector(`.card__category`);
		if(actions ?.onClick) {
			if(this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	set title(value: string) {
		this.setText(this._title, value)
	}
	set image(value: string) {
		this.setImage(this._image, value)
	}
	set price(value: number) {
		if(value === null) {
			this.setText(this._price, `Бесценно`)
		} else {
			this.setText(this._price, `${value} синапсов`)
		};
	}
	set category(value: string) {
		this.setText(this._category, value)
		this._category.className = `card__category card__category_${this._categoryColors[value]}`;
	}
}
export class ProductPreview extends Product {
	protected _description: HTMLElement;
	buttonElement: HTMLButtonElement;
	constructor(container: HTMLElement, actions ? : IActions) {
		super(container);
		this._description = container.querySelector(`.card__text`);
		this.buttonElement = container.querySelector(`.card__button`);
		if(actions ?.onClick) {
			if(this.buttonElement) {
				this.buttonElement.addEventListener('click', actions.onClick);
			}
		}
	}
	set description(value: string) {
		this.setText(this._description, value);
	}
}
export class BasketItem extends Product {
	buttonElement: HTMLButtonElement;
	protected _index: HTMLElement;
	constructor(container: HTMLElement, actions ? : IActions) {
		super(container);
		this._index = container.querySelector(`.basket__item-index`);
		this.buttonElement = container.querySelector(`.card__button`);
		if(actions ?.onClick) {
			if(this.buttonElement) {
				this.buttonElement.addEventListener('click', actions.onClick);
			}
		}
	}
	set index(value: number) {
		this.setText(this._index, value);
	}
}