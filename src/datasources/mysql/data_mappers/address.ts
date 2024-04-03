import logger from '@logger';
import {Address, City, Country, IAddress, State} from '@models';

export function addressDataMapping(payload: any, id?: string): IAddress {
    logger.info('data_stores.mysql.helpers.data_mapping.address.addressDataMapping()');
    try {
        if (payload) {
            return new Address(
                payload?.address_line_1,
                new City(payload?.city_id, payload?.city_name, payload?.city_code),
                new State(payload?.state_id, payload?.state_name, payload?.state_code),
                new Country(payload?.country_id, payload?.country_code, payload?.country_name),
                payload?.postal_code,
                payload?.address_line_2,
                id || payload.address_id,
            );
        }
        return payload;
    } catch (error) {
        logger.error('ERROR occurred in data_stores.mysql.helpers.data_mapping.address.addressDataMapping()');
        throw error;
    }
}
