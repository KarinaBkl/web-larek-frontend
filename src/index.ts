import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/specific/appdata';
import { Basket } from './components/specific/bascet';
import { ContactsForm } from './components/specific/contactform';
import { Modal } from './components/main/modal';
import { OrderForm } from './components/specific/adressform';
import { Page } from './components/specific/page';
import { Product } from './components/specific/product';
import { SendApi } from './components/specific/sendapi';
import { SuccessfulForm } from './components/specific/successfulform';
import {ICards, ICammonInfo, IFormError, ISuccessfulOrder} from './types';

const api = new SendApi(CDN_URL, API_URL);
const events = new EventEmitter();

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const appState = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const success = new SuccessfulForm(cloneTemplate(successTemplate), events);

api.getProductList()
	.then((result) => {
		appState.setProductList(result);
	})
	.catch((err) => {
		console.error(err);
	});

events.on('items:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const product = new Product('card',cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
		});
	});
});

events.on('card:select', (item: ICards) => {
	const card: Product = new Product(`card`,cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appState.isInBasket(item)) {
				appState.addToBasket(item);
			} else {
				appState.deleteFromBasket(item);
			}
			card.inBasket = appState.isInBasket(item);
		},
	});
	card.inBasket = appState.isInBasket(item);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

events.on('card:add', (item: ICards) => {
	appState.addToBasket(item);
});

events.on('card:remove', (item: ICards) => {
	appState.deleteFromBasket(item);
});

events.on('basket:open', () => {
	appState
	modal.render({ 
        content: basket.render({list: basket.list, total: basket.total}) });
});

events.on('basket:changed', () => {
	page.counter = appState.getNumberBasket();
	const items = appState.basket.map((item, index) => {
		const card = new Product('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:remove', item);
			},
		});
		return card.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});

	basket.render({list: items,total: appState.getTotalBasket(),
	});
});

events.on('order:open', () => {
	modal.render({
        content: order.render({
            valid: appState.setOrderErrors(),
            errors: [],
        }),
    })
});

events.on('order:submit', () => {
	modal.render({
        content: contacts.render({
            valid: appState.setContactsErrors(),
            errors: [],
        }),
    })
});

events.on('formErrors:change', (errors: IFormError) => {
	const { payment, address, email, phone } = errors;
    order.valid = !payment && !address;
    contacts.valid = !email && !phone;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

events.on('contacts:submit', () => {
	api
	.postOrder({
		...appState.order,
		total: appState.getTotalBasket(),
		items: appState.getBasketId(),
	})
		.then((result) => {
			order.resetForm();
			contacts.resetForm();
			events.emit('order:complete',result)
			appState.cleanBasket();
			page.counter = appState.getNumberBasket();
		})
		.catch(console.error);
})

events.on('order:complete', (res:ISuccessfulOrder) => {modal.render({content: success.render({total: res.total})})});

events.on('success:finish', () => modal.close());

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on(
	/^(order|contacts)\..*:change/, (data: { field: keyof ICammonInfo; value: string }) => {
		appState.setField(data.field, data.value);
	}
);