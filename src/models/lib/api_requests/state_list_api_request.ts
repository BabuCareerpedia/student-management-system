import {BaseListAPIRequest, IBaseListAPIRequest} from './base_list_api_request';

export type IStateListApiRequest = {
    countryId?: string;
} & IBaseListAPIRequest

export class StateListApiRequest extends BaseListAPIRequest implements IStateListApiRequest {
    public countryId?: string;

    constructor(searchText: string, offset: number, limit: number, queryId?: string, sortBy?: string,
                sortOrder?: string, countryId?: string) {
        super(searchText, offset, limit, queryId, sortBy, sortOrder);
        this.countryId = countryId;
    }
}
