import * as APIPaths from '@constants/api_path_constants';
import passport from 'passport';
import { USER_ROLES } from '@constants/master_data_constants';
import * as controller from '@controller/auth';
import { isAdmin, isAuthenticated, isUser } from '@middleware/authentication';
import * as validation from '@validations';
import { Router } from 'express';
import { passportConfiguration } from '@middleware/passport';
import { MailScopes, strategy } from '@constants/oauth_constants';


passportConfiguration(passport);

const router = Router();
router.use(passport.initialize());

router.route(APIPaths.STUDENT_GOOGLE_LOGIN)
  .post(controller.googleLogin)
  .get(passport.authenticate(strategy, {
    scope: MailScopes
  }));

// router.route(APIPaths.STUDENT_GOOGLE_REDIRECT)
//   .get(passport.authenticate(strategy, {
//     scope: MailScopes
//   }));

router.route(APIPaths.STUDENT_GOOGLE_CALLBACK)
  .get(
    passport.authenticate(strategy, { session: false }),
    (req, res, next) => {
      controller.googleLogin(req, res, next);
    }
  );

router.route(APIPaths.ADD_STUDENT_PHONE_NUMBER)
  .post(isAuthenticated, controller.addStudentPhoneNumber)

router.route('/login')
  .post(validation.validateLogin, controller.login);

router.route('/signup/:userType')
  .post(controller.signupUser);

router.route(APIPaths.GET_REFRESH_TOKEN)
  .post(validation.getAccessToken, controller.getMyAccessToken);

router.route(APIPaths.STUDENT_SIGNUP)
  .post(controller.studentSignup);

router.route(APIPaths.VERIFY_OTP)
  .post(isAuthenticated, controller.verifyOTP)

router.route(APIPaths.STUDENT_LOGIN)
  .post(controller.studentLogin)

router.route(APIPaths.STUDENT_CHANGE_PASSWORD)
  .patch(isUser([USER_ROLES.student]), controller.studentChangePassword)

router.route(APIPaths.STUDENT_FORGOT_PASSWORD)
  .post(controller.studentForgotPassword)

router.route(APIPaths.STUDENT_UPDATE_PASSWORD)
  .patch(isAuthenticated, controller.updateStudentPassword)

router.route(APIPaths.STUDENT_RESEND_OTP)
  .post(isAuthenticated, controller.resendStudentOTP)

router.route(APIPaths.ADMIN_REGISTER_MENTOR)
  .post(isAdmin, controller.registerMentor)

router.route(APIPaths.ADMIN_REGISTER_COLLEGE)
  .post(isAdmin, controller.registerCollege)

router.route(APIPaths.ADMIN_REGISTER_RECRUITER)
  .post(isAdmin, controller.registerRecruiter)

router.route(APIPaths.ADMIN_SIGNUP)
  .post(controller.adminSignup)

router.route(APIPaths.USER_LOGIN)
  .post(controller.userLogin)

router.route(APIPaths.USER_CHANGE_PASSWORD)
  .patch(isAuthenticated, controller.userChangePassword)

router.route(APIPaths.USER_FORGOT_PASSWORD)
  .post(controller.userForgotPassword)

router.route(APIPaths.USER_UPDATE_PASSWORD)
  .patch(isAuthenticated, controller.updateUserPassword)

router.route(APIPaths.USER_OTP_RESEND)
  .post(isAuthenticated, controller.resendUserEmailOTP)


export default router;
