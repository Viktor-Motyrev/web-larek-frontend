import { PaymentMethod, OrderFormData } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { FormView } from "./FormView";

export class OrderFormView extends FormView<OrderFormData> {
    protected _addressInput: HTMLInputElement;
    protected _cashButton: HTMLButtonElement;
    protected _cardButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._addressInput = container.querySelector('input[name="address"]');
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        this._cardButton.addEventListener('click', () => {
            this.events.emit(
                `formView: ${this.formName}.change`,
                { field: 'payment', value: 'card' }
            );
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit(
                `formView: ${this.formName}.change`,
                { field: 'payment', value: 'cash' }
            );
        });
    }

    set address(value: string) {
        console.log('orderFormView: address =', value);
        this._addressInput.value = value;
    }

    set payment(method: PaymentMethod | null) {
        console.log('orderFormView: payment =', method);
        // Обновляем визуальное состояние кнопок на основе данных из модели
        this._cardButton.classList.remove('button_alt-active');
        this._cashButton.classList.remove('button_alt-active');
        
        if (method === 'card') {
            this._cardButton.classList.add('button_alt-active');
        } else if (method === 'cash') {
            this._cashButton.classList.add('button_alt-active');
        }
    }
}