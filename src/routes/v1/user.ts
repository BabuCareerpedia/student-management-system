import * as APIPaths from '@constants/api_path_constants';
import * as UserController from '@controller/user';
import {Router} from 'express';
import {isAuthenticated} from '@middleware/authentication';
//import {isSuperAdminOrAdmin, userActionsPermission} from '@middleware/permission';
import * as Validation from '@validations';
import { SUB_PATH_USER_INSTANCE } from '@constants/api_path_constants'

const router = Router();

router.use(isAuthenticated);



router.route(APIPaths.SUB_PATH_USER_INSTANCE)
    .get(/*isSuperAdminOrAdmin,*/ Validation.getUsers, UserController.getUserDetails);
   /* .post(isSuperAdminOrAdmin, UserValidation.createUser, isSuperAdminOrAdmin, UserController.createUser);

router.route(APIPaths.SUB_PATH_USER_INSTANCE)
    .get(UserValidation.getUserDetails, UserController.getUserDetails);
// .put(UserValidation.updateUser, UserController.updateUser);

router.route(APIPaths.SUB_PATH_USER_ACTION)
    .put(userActionsPermission, UserValidation.updateUserAction, UserController.updateUserAction);
router.route(APIPaths.SUB_PATH_USER_ROLE)
    .put(isSuperAdminOrAdmin, UserValidation.updateUserRole, UserController.updateUserRole);
*/
export default router;
