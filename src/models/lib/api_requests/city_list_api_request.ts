import {BaseListAPIRequest, IBaseListAPIRequest} from './base_list_api_request';

export type ICityListApiRequest = {
    stateId?: string;
    countryId?: string;
} & IBaseListAPIRequest

export class CityListApiRequest extends BaseListAPIRequest implements ICityListApiRequest {
    public stateId?: string;
    public countryId?: string;

    constructor(searchText: string, offset: number, limit: number, queryId?: string, sortBy?: string,
                sortOrder?: string, stateId?: string, countryId?: string) {
        super(searchText, offset, limit, queryId, sortBy, sortOrder);
        this.stateId = stateId;
        this.countryId = countryId;
    }
}
