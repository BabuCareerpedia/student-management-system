import { NextFunction, Response } from 'express';
import { responseBuilder } from '@helpers/response_builder';
import log from '@logger';
import { IServiceResponse, IUser, IUserSession } from '@models';
import * as authService from '@service/auth';
import { PathParams } from "@constants/api_param_constants";
import { userDataMapping } from "@helpers/data_mapping/user";
import { CONTACT_TYPE, ROLES, USER_ROLES } from '@constants/master_data_constants';

const TAG = 'controller.auth';

export async function studentSignup(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.studentSignup()`);
        log.debug(`signup object = ${JSON.stringify(req.body)}`);
        const user: IUser = userDataMapping(req.body);
        const authResposne: IServiceResponse = await authService.studentSignup(user);
        responseBuilder(authResposne, res, next, req);
    } catch (error) {
        log.error(`ERROR occurrred in ${TAG}.studentSignup()`, error);
        next(error);
    }
}

export async function verifyOTP(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.verifyOTP`);
        log.debug(`otp object = ${JSON.stringify(req.body)}`);
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.verifyOTP(req.body, userSession)
        responseBuilder(authResponse, res, next, req)

    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.verifyOTP() `, error);
        next(error);
    }
}

// export async function verifyPhoneOTP(req: any, res: Response, next: NextFunction): Promise<void> {
//     try {
//         log.info(TAG + `.verifyPhoneOTP`);
//         log.debug(`otp object = ${JSON.stringify(req.body)}`);
//         const userSession: IUserSession = req.userSession;
//         const contactType = CONTACT_TYPE.phone
//         const authResponse: IServiceResponse = await authService.verifyOTP(req.body.otp, userSession, contactType)
//         responseBuilder(authResponse, res, next, req)

//     } catch (error) {
//         log.error(`ERROR occurred in ${TAG}.verifyPhoneOTP() `, error);
//         next(error);
//     }
// }

export async function studentLogin(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.studentLogin()`);
        log.debug(`login object = ${JSON.stringify(req.body)}`);
        const authResponse: IServiceResponse = await authService.studentLogin(req.body);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.studentLogin() `, error);
        next(error);
    }
}

export async function googleLogin(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(`googleLogin() `);
        log.debug(`google login object = ${JSON.stringify(req.user)}`);
        const authResponse: IServiceResponse = await authService.googleLogin(req.user);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.googleLogin `, error);
        next(error);
    }
}

export async function addStudentPhoneNumber(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(`addStudentPhoneNumber()`);
        log.debug(`student phone number = ${JSON.stringify(req.body)}`);
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.addStudentPhoneNumber(userSession, req.body.phone)
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.addStudentPhoneNumber() `, error);
        next(error);
    }
}
export async function studentChangePassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.studentChangePassword()`);
        log.debug(`student change password object = ${JSON.stringify(req.body)}`);
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.studentChangePassword(req.body, userSession);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.studentChangePassword() `, error);
        next(error);
    }
}

export async function studentForgotPassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.studentForgotPassword()`);
        log.debug(`send student forgot password object = ${JSON.stringify(req.body)}`);
        const authResponse: IServiceResponse = await authService.studentForgotPassword(req.body.email);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.studentForgotPassword() `, error);
        next(error);
    }
}

export async function updateStudentPassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.updateStudentPassword()`);
        log.debug(`student forgot password object = ${JSON.stringify(req.body)}`);
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.updateStudentPassword(req.body.password, userSession);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.updateStudentPassword() `, error);
        next(error);
    }
}

export async function resendStudentOTP(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.resendStudentOTP()`);
        // log.debug(`student resend email otp object = ${JSON.stringify(req.body)}`);
        const userSession: IUserSession = req.userSession;
        const isStudent = true;
        const authResponse: IServiceResponse = await authService.sendEmailOTP(userSession, isStudent, req.body.contactType);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.resendStudentEmailOTP() `, error);
        next(error);
    }
}

export async function userLogin(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.userLogin()`);
        log.debug(`login object = ${JSON.stringify(req.body)}`);
        const authResponse: IServiceResponse = await authService.userLogin(req.body);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.userLogin() `, error);
        next(error);
    }
}

export async function registerMentor(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.registerMentor()`);
        log.debug(`mentor signup object = ${JSON.stringify(req.body)}`);
        const role = USER_ROLES.mentor;
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.userSignup(req.body, role, userSession);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.mentorSignup() `, error);
        next(error);
    }
}

export async function registerCollege(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.registerCollege()`);
        log.debug(`college signup object = ${JSON.stringify(req.body)}`);
        const role = USER_ROLES.collegeAdmin;
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.userSignup(req.body, role, userSession);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.collegeSignup() `, error);
        next(error);
    }

}

export async function registerRecruiter(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.registerRecruiter()`);
        log.debug(`recruiter signup object = ${JSON.stringify(req.body)}`);
        const role = USER_ROLES.recruiter;
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.userSignup(req.body, role, userSession);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.recruiterSignup() `, error);
        next(error);
    }

}

export async function adminSignup(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.adminSignup()`);
        log.debug(`admin signup object = ${JSON.stringify(req.body)}`);
        const role = USER_ROLES.admin;
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.userSignup(req.body, role, userSession);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.adminSignup() `, error);
        next(error);
    }
}

export async function userChangePassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.userChangePassword()`);
        log.debug(`user change password object = ${JSON.stringify(req.body)}`);
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.userChangePassword(req.body, userSession);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.userChangePassword() `, error);
        next(error);
    }
}

export async function userForgotPassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.userForgotPassword()`);
        log.debug(`user send email otp object = ${JSON.stringify(req.body)}`);
        const authResponse: IServiceResponse = await authService.userForgotPassword(req.body.email);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.userForgotPassword() `, error);
        next(error);
    }
}

export async function updateUserPassword(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.updateUserPassword()`);
        log.debug(`update user password object = ${JSON.stringify(req.body)}`)
        const userSession: IUserSession = req.userSession;
        const authResponse: IServiceResponse = await authService.updateUserPassword(req.body.password, userSession);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.updateUserPassword() `, error);
        next(error);
    }
}

export async function resendUserEmailOTP(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.resendUserEmailOTP()`);
        log.debug(`user resend user email otp  = ${JSON.stringify(req.body)}`);
        const userSession: IUserSession = req.userSession;
        const isStudent = false;
        const authResponse: IServiceResponse = await authService.sendEmailOTP(userSession, isStudent, CONTACT_TYPE.email);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.resendUserEmailOTP() `, error);
        next(error);
    }
}

export async function login(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(`login()`);
        log.debug(`login Object = ${JSON.stringify(req.body)}`);
        const authResponse: IServiceResponse = await authService.loginUser(req.body);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error('ERROR occurred in controllers.auth.login()', error);
        next(error);
    }
}


export async function signupUser(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(`${TAG}.signupUser()`);
        log.debug(`${TAG}.signupUser() Object = ${JSON.stringify(req.body)}`)
        const userType = req.params[PathParams.USER_TYPE];
        const user: IUser = userDataMapping(req.body);
        const authResponse: IServiceResponse = await authService.signupUser(user, userType)
        responseBuilder(authResponse, res, next, req)
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.signupUser() `, error)
        next(error)
    }
}

export async function getMyAccessToken(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(`getMyAccessToken()`);
        log.debug(`login Object = ${JSON.stringify(req.body)}`);
        const authResponse: IServiceResponse = await authService.fetchAccessToken(req.body);
        responseBuilder(authResponse, res, next, req);
    } catch (error) {
        log.error('ERROR occurred in controllers.auth.getMyAccessToken()', error);
        next(error);
    }
}
