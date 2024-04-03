import logger from '@logger';
import {EmailSender, IEmailSender} from '@models';

export function emailSenderDataMapping(payload: any): IEmailSender {
    try {
        return new EmailSender(
            payload?.fromEmailId,
            payload?.name,
            payload?.greeting,
            payload?.contactNumber,
            payload?.contactAddress,
        );
    } catch (error) {
        logger.error('ERROR occurred in helpers.data_mapping.address.emailSenderDataMapping()');
        throw error;
    }
}
