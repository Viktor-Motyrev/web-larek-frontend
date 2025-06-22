import './scss/styles.scss';
import { AppApi } from './components/AppAPI';
import { AppPage } from './components/AppPage';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { BasketView } from './components/BasketView';
import { CardBasket, CardPreview, CardShowcase } from './components/CardView';
import { ContactsFormView } from './components/ContactsFormView';
import { IFormState } from './components/FormView';
import { Modal } from './components/Modal';
import { Order } from './components/Order';
import { OrderFormView } from './components/OrderFormView';
import { Showcase } from './components/Showcase';
import { SuccessView } from './components/SuccessView';
import { ApiClient, ServerItem, OrderFormData } from './types';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate, calculateBasketTotal } from './utils/utils';

const events = new EventEmitter();

const showcase = new Showcase(events);
const basket = new Basket(events);
const order = new Order(events);


const baseApi: ApiClient = new Api(API_URL, settings);
const api = new AppApi(baseApi);

events.onAll((event) => {
    console.log('msg->', event.eventName, event.data)
})

const modal = new Modal(document.querySelector('#modal-container'), events);
const page = new AppPage(document.body, events);

const cardCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');

const formContactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const formOrderTemplate: HTMLTemplateElement = document.querySelector('#order');

const basketContainerTemplate: HTMLTemplateElement = document.querySelector('#basket');
const successContainerTemplate: HTMLTemplateElement = document.querySelector('#success');

const basketView = new BasketView( cloneTemplate(basketContainerTemplate), events);
const orderFormView = new OrderFormView( cloneTemplate(formOrderTemplate), events)
const contactsFormView = new ContactsFormView( cloneTemplate(formContactsTemplate), events)


const successView = new SuccessView(cloneTemplate(successContainerTemplate), events);

function updateBasketContent() {
	const items = showcase.items
		.filter(item => basket.alreadyInBasket(item.id))
		.map((item: ServerItem, index: number) => {
		const card = new CardBasket( cloneTemplate(cardBasketTemplate), events);
		const renderedCard = card.render(item);
		card.setItemIndex(index + 1);
		return renderedCard;
	});

	basketView.items = items;
	const total = calculateBasketTotal(basket.getItemIds(), showcase.items);
	basketView.total = { price: total, itemsCount: items.length };
}

function showBasket() {
	updateBasketContent();
	modal.content = basketView.containerElement;
}

getShowcase();

function getShowcase() {
	api.getShowcase()
		.then((items) => {
			showcase.items = items;
		})
		.catch((err) => {
			console.error('Ошибка при получении:', err);
		});
	}

// Обработка данных showcase только после подтверждения от модели
events.on('showcase:changed', () => {
	const itemsArray = showcase.items.map((item, index)=> {
		const cardView = new CardShowcase( cloneTemplate(cardCatalogTemplate), events);
		return cardView.render(item);
	});
	page.render({ galleryItems : itemsArray });
});

// После инициализации приложения вручную вызываем basket:changed для синхронизации UI
setTimeout(() => {
    events.emit('basket:changed');
}, 0);

// **************************** Наши событиия ***************************** //

// новые данные для contactsForm из order
events.on('order: contactsForm NewData', (data: Partial<OrderFormData> & IFormState) => {
	contactsFormView.render( data);
});

// новые данные для orderForm из order
events.on('order: orderForm NewData', (data: Partial<OrderFormData> & IFormState) => {
	orderFormView.render( data);
});

// данные изменились в модели Order
events.on('order: dataChanged', (data: { field: keyof OrderFormData; value: any }) => {
	// Обновляем соответствующее поле в представлении
	if (data.field === 'address') {
		orderFormView.address = data.value;
	} else if (data.field === 'payment') {
		orderFormView.payment = data.value;
	} else if (data.field === 'email') {
		contactsFormView.email = data.value;
	} else if (data.field === 'phone') {
		contactsFormView.phone = data.value;
	}
});

// нажата кнопка Оплатить в contactsForm
events.on('formView: contactsForm.submit', () => {
	successView.total = 0;
	const basketItems = showcase.items.filter(item => basket.alreadyInBasket(item.id));
	const total = calculateBasketTotal(basket.getItemIds(), showcase.items);
	const orderData = order.getOrderData();
	
	// Если total равен null (есть бесценные товары), отправляем 0
	const costToSend = total === null ? 0 : total;
	
	api.postOrder(orderData, basketItems, costToSend)
		.then((data) => {
			basket.clear();
			successView.total = data.total || 0;
			modal.content = successView.render();
			modal.open();
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});	

});

// нажата кнопка Далее в orderForm
events.on('formView: orderForm.submit', () => {
	modal.content = contactsFormView.render();	
	order.validateContactForm('SSS')
});

// нажата кнопка Оформить в корзине
events.on('basketView: showOrderForm', () => {
	modal.content = orderFormView.render();
	order.validateOrderForm('ZZZ')
//	modal.open();
});

// изменен адрес (formView) или способ оплаты (orderFormView) в orderForm
events.on('formView: orderForm.change', (data: { field: keyof OrderFormData; value: string }) => {
	order.setFieldData(data.field, data.value);
	order.validateOrderForm( '***')
});

// изменен телефон или email в contactsForm
events.on('formView: contactsForm.change', (data: { field: keyof OrderFormData; value: string }) => {
	order.setFieldData(data.field, data.value);
	order.validateContactForm( '+++')
});

// нажата кнопка В корзину в предпросмотре карточки
events.on('CardPreview: move_item_to_basket', ({ itemID }: { itemID: string }) => {
	const item = showcase.getItem(itemID);
	if (!item) return;
	if (item.price === null) {
		// Показываем модальное окно с ошибкой
		const errorDiv = document.createElement('div');
		errorDiv.style.padding = '2rem';
		errorDiv.style.textAlign = 'center';
		errorDiv.innerHTML = '<h2>Этот товар нельзя добавить в корзину</h2><p>Товар "' + item.title + '" не имеет цены и не может быть куплен.</p>';
		modal.content = errorDiv;
		modal.open();
		return;
	}
	basket.addItem(item.id);
	modal.close();
});

// обновление представления после изменения данных в корзине
events.on('basket:changed', () => {
	page.basketCount = basket.getCount();
	updateBasketContent();
	
	// Если корзина пуста, закрываем модальное окно
	if (basket.getCount() === 0) {
		modal.close();
	}
});

// блокировка/разблокировка прокрутки при открытии/закрытии модалки
events.on('modal: page.scrollLocked', ({ lock }: { lock: boolean }) => {
	page.scrollLocked = lock;
});

// кликнули по карточке на витрине
events.on('CardShowcase: show_preview', ({ itemID }: { itemID: string }) => {
	const item = showcase.getItem(itemID);
	const cardPreview = new CardPreview(
		cloneTemplate(cardPreviewTemplate), 
		events
	);
	cardPreview.render(item);
	cardPreview.setInBasket(basket.alreadyInBasket(item.id));
	// Делаем кнопку "В корзину" неактивной для бесценных товаров
	if (item.price === null) {
		const btn = cardPreview["_toBasketButton"];
		if (btn) {
			btn.disabled = true;
			btn.textContent = 'Нельзя купить';
		}
	}
	modal.content = cardPreview.containerElement;
	modal.open();
});

// нажали изображение корзины на главной странице
events.on('page: openBasket', () => {
	showBasket();
	modal.open();
});

// нажали кнопку **За новыми покупками** в successView
events.on('successView: submit', () => {
	basket.clear();
});

// в корзинной карточке нажали кнопку удаления
events.on('CardBasket: delete_from_basket', ({ itemID }: { itemID: string }) => {
	basket.removeItem(itemID);
});
