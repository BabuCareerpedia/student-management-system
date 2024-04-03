import * as APIPaths from '@constants/api_path_constants';
import passport from 'passport';
import { USER_ROLES } from '@constants/master_data_constants';
import * as controller from '@controller/mentor';
import { isUser } from '@middleware/authentication';
import * as validation from '@validations';
import { Router } from 'express';


const router = Router();


router.route(APIPaths.MENTOR)
  .post(isUser([USER_ROLES.mentor]),controller.saveMentorProfileDetails)
  .get(isUser([USER_ROLES.mentor]),controller.fetchMentorProfileDetails);

export default router;