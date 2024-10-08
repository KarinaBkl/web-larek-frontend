import { IEvents } from '../components/base/events';

// карточка товара
export interface ICards {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
    index?: number;
}

// действия с карточками
export interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

// массив карточек на главной странице
export interface ICardsList {
    items: ICards[];
    preview: string | null;
}

// страница с товаром
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
}

// модальное окно
export interface IModalInfo {
	content: HTMLElement;
}

// информация о товарах в корзине
export type IBasket = Pick<ICards, 'title' | 'price'>;

// информация о  товарах в корзине
export interface IBasketInfo {
    list: HTMLElement[];
    total: number
}

//форма ввода информации о способе оплаты и адресе 
export interface IPayment {
    payment: string;
    address: string;
}

//форма ввода контактных данных пользователя
export interface IBuyerInfo {
    email: string;
    phone: string;
}

// данные формы
export interface IFormInfo {
    valid: boolean;
    errors: string[];
    address: string;
    payment: string;
    phone: string;
    email: string;
}

//общие данные для заказа
export type ICammonInfo = IPayment & IBuyerInfo;

//данные для отправки заказа
export type IShoppingPost = ICammonInfo & {
    total: number;
    items: string[];
}

//вывод текста ошибок
export type IFormError = Partial<ICammonInfo>;

//валидация форм
export interface IPaymentData {
    CheckValidation(data: Record<keyof IPayment, string>): boolean;
}

export interface IBuyerInfoData {
    CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean;
}

//форма успешной оплаты
export interface ISuccessfulOrder {
    id: string;
    total: number;
}

// информация об успешной форме
export interface ISuccessfulFormInfo {
    total: number;
}

//общие данные о магазине
export interface IAppInfo {
    catalog: ICards[];
    basket: ICards[];
    order: ICammonInfo;
    formError: IFormError;
    events: IEvents;
}