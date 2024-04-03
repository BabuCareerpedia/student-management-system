import logger from '@logger';
import {IPhone, Phone} from '@models';

export function phoneDataMapping(payload: any, id?: string): IPhone {
    logger.info('helpers.data_mapping.phone.phoneDataMapping()');
    try {
        if (!payload) {
            payload = {};
        }
        return new Phone(
            payload?.phoneCountryCode,
            payload?.phoneNumber
        );
    } catch (error) {
        logger.error('ERROR occurred in helpers.data_mapping.phone.phoneDataMapping()');
    }
}
