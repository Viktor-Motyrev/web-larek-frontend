import { ServerItem, ItemCategory, CategoryMapping } from "../types";
import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { CDN_URL } from "../utils/constants";


// ServerItem - интерфейс для рендера
export class CardView extends Component<ServerItem>  {
    protected events: IEvents;    

    protected _itemID: string;
    protected _price: HTMLElement;
    protected _title: HTMLElement;

 	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
        this.events = events;

        this._title = this.container.querySelector('.card__title') as HTMLElement;
        this._price = this.container.querySelector('.card__price') as HTMLElement;
    }

    set price(value: number | null) {
        this._price.textContent = (value ? `${value} синапсов` : 'Бесценно');
    }

    set id(value:string) {
        this._itemID = value;
    }

    set title( value:string) {
        this._title.textContent = value;
    }
}

export class CardPreview extends CardView {
    protected _image: HTMLImageElement;
    protected _description: HTMLElement;
    protected _category: HTMLElement;
    protected _toBasketButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this._description = this.container.querySelector('.card__text');
        this._toBasketButton = this.container.querySelector('.card__button');
        
        this._toBasketButton.addEventListener('click', () => {
	        this.events.emit('CardPreview: move_item_to_basket', { itemID: this._itemID });
        });
    }

    set category(value: ItemCategory) { 
        if( this._category) {
            this._category.textContent = value;
            this._category.className = "card__category"; // сброс классов
            this._category.classList.add(`card__category_${CategoryMapping[value]}`);
        }
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = CDN_URL + value;
        }
    }

    set description(value: string) {
        if (this._description) { 
            this._description.textContent = value;
        }
    }

    setInBasket(value: boolean) {
        if(this._toBasketButton) {
            this.changeDisabledState(this._toBasketButton, value);
            this._toBasketButton.textContent = ( value ? 'Уже в корзине' : 'В корзину');
        }
    }
}

export class CardBasket extends CardView {
    protected itemDelete: HTMLButtonElement;
    protected _itemIndex: HTMLElement;
    
    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this._itemIndex = this.container.querySelector('.basket__item-index');
        this.itemDelete = this.container.querySelector('.basket__item-delete');

        this.itemDelete.addEventListener('click', () =>
	        this.events.emit('CardBasket: delete_from_basket', { itemID: this._itemID })
	    );
    }

    setItemIndex(value: number) {
        if (this._itemIndex) { 
            this._itemIndex.textContent = String(value);
        }
    }
}

export class CardShowcase extends CardView {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _toBasketButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this._toBasketButton = this.container.querySelector('.card__button');

        this.container.addEventListener('click', () =>
            this.events.emit('CardShowcase: show_preview', { itemID: this._itemID })
        );
    };

    set category(value: ItemCategory) { 
        if( this._category) {
            this._category.textContent = value;
            this._category.className = "card__category"; // сброс классов
            this._category.classList.add(`card__category_${CategoryMapping[value]}`);
        }
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = CDN_URL + value;
        }
    }

    setInBasket(value: boolean) {
        if(this._toBasketButton) {
            this.changeDisabledState(this._toBasketButton, value);
            this._toBasketButton.textContent = ( value ? 'Уже в корзине' : 'В корзину');
        }
    }
}
