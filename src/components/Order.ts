import { Order as IOrder, OrderFormData as IOrderData, PaymentMethod} from "../types";
import { IEvents } from "./base/events";

export class Order implements IOrder {
    protected _address = '';
    protected _email = '';
    protected _payment: PaymentMethod = 'null';
    protected _phone = '';
    protected events: IEvents;
       
    constructor(events: IEvents) {
        this.events = events;
        this.clear();
    }

    clear() {
        this._address = "";
        this._email = "";
        this._payment = 'null';
        this._phone = "";
    }

    set address(value: string) {
        this._address = value;
        this.events.emit('order: dataChanged', { field: 'address', value });
    }
    get address(): string {return this._address;}

    set phone(value: string) {
        this._phone = value;
        this.events.emit('order: dataChanged', { field: 'phone', value });
    }
    get phone(): string {return this._phone;}

    set email(value: string) {
        this._email = value;
        this.events.emit('order: dataChanged', { field: 'email', value });
    }
    get email(): string {return this._email;}

    set payment(value: PaymentMethod) {
        this._payment = value;
        this.events.emit('order: dataChanged', { field: 'payment', value });
    }
    get payment(): PaymentMethod {return this._payment;}

    validateOrderForm(msg: string) {
        console.log('VALIDATE_orderForm: ', msg);
        console.log(`проверяем значения: _paymentMethod=${this._payment} address="${this._address}"`)

     	let valid = true;
     	let message = '';

     	if (!this._address) {
    		valid = false;
    		message = 'Введите адрес доставки.';
    	} 

        if (this._payment === 'null') {
    		valid = false;
    		message += (message ? ' ': '') +'Выберите способ оплаты.';
    	}

        this.events.emit(
            'order: orderForm NewData',
             {
                address: this._address,
                payment: this._payment,
                valid: valid,
                errors: message
            }
        );
    }

    validateContactForm(msg: string) {
        console.log('VALIDATE_contactForm: ', msg);
        console.log(`проверяем значения: email=${this._email} phone="${this._phone}"`)

     	let valid = true;
     	let message = '';


     	if (!this._email) {
    		valid = false;
    		message = 'Введите свою почту';
    	} 

     	if (!this._phone) {
    		valid = false;
    		message += (message ? ' ': '') +'и номер телефона!';
    	} 

        this.events.emit(
            'order: contactsForm NewData',
             {
                email: this._email,
                phone: this._phone,
                valid: valid,
                errors: message
            }
        );
    }

    setFieldData<T extends keyof IOrderData>(field: T, value: IOrderData[T]) {
        console.log('setFieldData', field, value);
        switch (field) {
            case 'address':
                this.address = value as string;
                break;
            case 'email':
                this.email = value as string;
                break;
            case 'payment':
                this.payment = value as PaymentMethod;
                break;
            case 'phone':
                this.phone = value as string;
                break;
            default:
                console.warn(`Unknown field: ${field}`);
        }
    }

    getOrderData(): IOrderData {
        return {
            address: this._address,
            email: this._email,
            payment: this._payment,
            phone: this._phone,
        };
    }
}