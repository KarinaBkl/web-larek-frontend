import { IEvents } from '../components/base/events';
// данные карточки товара
interface ICards{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

// массив карточек на главной странице
interface ICardssList {
    items: ICards[];
    preview: string | null;
}

// информация о товарах в корзине
 type IBasket = Pick<ICards, 'title' | 'price'>;

// интерфейсы для формы заказа
interface IPayment {
    pay: string;
    address: string;
}

interface IBuyerInfo {
    email: string;
    phone: string;
}

//общие данные для заказа
 type ICammonInfo = IPayment & IBuyerInfo;

 type IShoppingPost = ICammonInfo & {
    total: number;
    items: string[];
}

//вывод текста ошибок
type IFormError = Partial<Record<keyof ICammonInfo, string>>;

//валидация форм
 interface IPaymentData {
    CheckValidation(data: Record<keyof IPayment, string>): boolean;
 }
 interface IBuyerInfoData {
    CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean;
}

//форма успешной оплаты
interface ISuccessfulPayment {
    id: string;
    total: number;
}

// данные о магазине
export interface IAppInfo {
    catalog: ICards[];
    basket: ICards[];
    order: ICammonInfo;
    formError: IFormError;
    events: IEvents;
}