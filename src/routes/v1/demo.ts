import * as APIPaths from '@constants/api_path_constants';
import passport from 'passport';
import { USER_ROLES } from '@constants/master_data_constants';
import * as controller from '@controller/auth';
import { isAdmin, isAuthenticated, isUser } from '@middleware/authentication';
import * as validation from '@validations';
import { Router } from 'express';
import { passportConfiguration } from '@middleware/passport';
import { MailScopes, strategy } from '@constants/oauth_constants';
import * as demoController from '@controller/demo'

passportConfiguration(passport);

const router = Router();
router.use(passport.initialize());


router.route('/demo')
.post(demoController.savedemoProfileDetails)
// .patch(demoController.updatedemoProfileDetails)


export default router;