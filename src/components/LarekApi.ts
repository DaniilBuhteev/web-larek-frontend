import { IProduct, ISuccess, IOrder } from '../types';
import { Api, ApiListResponse } from './base/Api';



export class LarekApi extends Api {
	readonly cdn: string;
	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({ ...item, image: this.cdn + item.image }))
		);
	}
	orderResult(order: IOrder): Promise<ISuccess> {
		return this.post(`/order`, order).then((data: ISuccess) => data);
	}
}
