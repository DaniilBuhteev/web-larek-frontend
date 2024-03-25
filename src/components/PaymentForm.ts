import {
	Form
} from "./Form";
import {
	IPaymentForm
} from "../types";
import {
	IEvents
} from "./base/events";
import {
	ensureAllElements
} from "../utils/utils";
export class PaymentForm extends Form < IPaymentForm > {
	protected _buttons: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements < HTMLButtonElement > ('.button_alt', container);
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				events.emit('payment:change', button);
			});
		});
	}
	set payment(value: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}