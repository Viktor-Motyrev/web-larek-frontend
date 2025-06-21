import { ApiClient, OrderFormData as IOrderData, OrderResult as IOrderResponse, ServerItem } from "../types";

interface ApiListResponse<T> {
    total: number;
    items: T[];
}

export class AppApi {
	private _baseApi: ApiClient;

	constructor(baseApi: ApiClient) {
		this._baseApi = baseApi;
	}

    getShowcase(): Promise<ServerItem[]> {
		return this._baseApi.get<ApiListResponse<ServerItem>>(`/product`)
			.then((response) => response.items);
	}

	getItemById(id: string): Promise<ServerItem> {
    	return this._baseApi.get<ServerItem>(`/product/${id}`);
	}

	postOrder(order: IOrderData, items: ServerItem[], cost: number): Promise<IOrderResponse> {
		const payload = {
    		...order,
			total: cost,
			items: items.map(item => item.id),
		};
  		return this._baseApi.post<IOrderResponse>('/order', payload);
	}
}