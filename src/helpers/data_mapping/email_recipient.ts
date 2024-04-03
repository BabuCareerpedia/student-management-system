import logger from '@logger';
import {EmailRecipient, IEmailRecipient} from '@models';

export function emailRecipientDataMapping(payload: any): IEmailRecipient {
    try {
        return new EmailRecipient(
            payload?.toEmails,
            payload?.ccEmails,
            payload?.bccEmails,
        );
    } catch (error) {
        logger.error('ERROR occurred in helpers.data_mapping.address.emailRecipientDataMapping()');
        throw error;
    }
}
