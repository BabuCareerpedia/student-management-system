import logger from '@logger';
import {
    BaseListAPIRequest,
    CityListApiRequest,
    IBaseListAPIRequest,
    ICityListApiRequest,
    StateListApiRequest,
    IStateListApiRequest
} from '@models';


export function requestQueryDataMapping(query: any): IBaseListAPIRequest {
    logger.info('helpers.data_mapping.request_query.requestQueryDataMapping()');

    try {
        return new BaseListAPIRequest(
            query?.searchText,
            query?.offset,
            query?.limit,
            query?.queryId,
            query?.sortBy,
            query?.sortOrder,
        );
    } catch (error) {
        logger.error('ERROR occurred in helpers.request_query.requestQueryDataMapping()');
    }
}


export function requestStateQueryDataMapping(query: any): IStateListApiRequest {
    logger.info('helpers.data_mapping.request_query.requestStateQueryDataMapping()');

    try {
        return new StateListApiRequest(
            query?.searchText,
            query?.offset,
            query?.limit,
            query?.queryId,
            query?.sortBy,
            query?.sortOrder,
            query?.countryId,
        );
    } catch (error) {
        logger.error('ERROR occurred in helpers.request_query.requestStateQueryDataMapping()');
    }
}

export function requestCityQueryDataMapping(query: any): ICityListApiRequest {
    logger.info('helpers.data_mapping.request_query.requestCityQueryDataMapping()');

    try {
        return new CityListApiRequest(
            query?.searchText,
            query?.offset,
            query?.limit,
            query?.queryId,
            query?.sortBy,
            query?.sortOrder,
            query?.stateId,
            query?.countryId,
        );
    } catch (error) {
        logger.error('ERROR occurred in helpers.request_query.requestCityQueryDataMapping()');
    }
}
