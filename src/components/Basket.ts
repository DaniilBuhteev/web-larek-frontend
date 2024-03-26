import { IBasket } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { AppState } from './AppState';
import { Component } from './base/Component';
import { EventEmitter } from './base/Events';
export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected button: HTMLButtonElement;
	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');
		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('payment:open');
			});
		}
		this.items = [];
	}
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.button.disabled = false;
			this.button.textContent = 'Оформить';
		} else {
			this.button.disabled = true;
			this.button.textContent = 'Выберете товар';
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number | string) {
		this.setText(this._total, total + ' синапсов');
	}
}
