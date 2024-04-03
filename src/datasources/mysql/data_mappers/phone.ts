import logger from '@logger';
import {IPhone, Phone} from '@models';

export function phoneDataMapping(payload: any): IPhone {
    logger.info('data_stores.mysql.helpers.data_mapping.phone.addressDataMapping()');
    try {
        if (payload) {
            return new Phone(
                payload.phone_country_code,
                payload.phone
            );
        }
        return payload;
    } catch (error) {
        logger.error('ERROR occurred in data_stores.mysql.helpers.data_mapping.phone.addressDataMapping()');
        throw error;
    }
}
