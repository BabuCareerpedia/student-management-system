import logger from '@logger';
import { BaseRecord, IUser, User } from '@models';

export function userDataMapping(payload: any): IUser {
    logger.info('helpers.data_mapping.user.userDataMapping()')
    try {
        if (payload != null && payload !== undefined) {
            return new User(
                payload.firstName,
                payload.lastName,
                payload.email,
                payload?.phone,
                payload?.password,
                payload?.termsAndCondition
            )
        }
        return payload
    } catch (error) {
        logger.error('ERROR occurred in helpers.data_mapping.user.userDataMapping()')
        throw error
    }
}


