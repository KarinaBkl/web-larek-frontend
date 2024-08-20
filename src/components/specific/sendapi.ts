import { Api, ApiListResponse } from '../base/api';
import { ICards, ISuccessfulOrder, IShoppingPost} from '../../types';

export class SendApi extends Api {
	protected _cdn: string;
	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this._cdn = cdn;
	}
	getProductItem(id: string): Promise<ICards> {
        return this.get(`/product/${id}`).then(
            (item: ICards) => ({
                ...item,
                image: `${this._cdn}${item.image}`,
            })
        );
    }
	getProductList(): Promise<ICards[]> {
		return this.get('/product').then((data: ApiListResponse<ICards>) =>
			data.items.map(item => ({
				...item,
				image: `${this._cdn}${item.image}`,
			}))
		);
	}
	postOrder(orderData: IShoppingPost): Promise<ISuccessfulOrder> {
        return this.post(`/order`, orderData).then((orderResult: ISuccessfulOrder) => orderResult)
	}
}