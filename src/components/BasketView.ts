import { ServerItem as IItem } from "../types";
import { Component } from "./base/component";
import { IEvents } from "./base/events";


export interface IBasketContent {
    items: IItem[];
	total: number | null;
    itemsCount: number;
}

export class BasketView extends Component<IBasketContent> {
    protected _content: HTMLElement;

    protected _listContainer: HTMLElement;
	protected _priceContainer: HTMLElement;
	protected _orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._listContainer = this.container.querySelector('.basket__list');
	    this._priceContainer = this.container.querySelector('.basket__price');
	    this._orderButton = this.container.querySelector('.basket__button');

        this._orderButton.addEventListener('click', () => {
			this.events.emit('basketView: showOrderForm');
		});
    }

 
    get containerElement(): HTMLElement {
        return this.container;
    }
   
    set items(items: HTMLElement[]) {
		this._listContainer.replaceChildren(...items);
	}

	set total(data: { price: number | null; itemsCount: number }) {
		const { price, itemsCount } = data;
		if (price === null) {
			this._priceContainer.textContent = 'Бесценно';
		} else {
			this._priceContainer.textContent = `${price} синапсов`;
		}
        this.changeDisabledState(this._orderButton, itemsCount === 0); // Кнопка неактивна если корзина пуста
	}
}