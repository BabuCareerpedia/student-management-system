import HandleBars from 'handlebars';
import {CONF_DIR_PATH} from '@config';
import log from '@logger';

const TEMPLATES_DIR_PATH = CONF_DIR_PATH + 'templates';

const compiledTemplates: any = {};
const TAG = 'loaders.template';

export function loadTemplates() {
    log.info(`${TAG}.loadTemplates()`);
    log.debug(`STARTED compiling the handlebar html templates.`);
    try {
        if (Object.keys(compiledTemplates).length > 0) {
            return compiledTemplates;
        }
        compiledTemplates.EMAIL_REMINDER_TEMPLATE = HandleBars.compile(TEMPLATES_DIR_PATH + '/email/reminder.html');
        compiledTemplates.INVITE_EMAIL = HandleBars.compile(TEMPLATES_DIR_PATH + '/email/invite_user.html');
        // TODO For all templates repeat the above instruction
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.loadTemplates()`, error);
        throw error;
    }
}
