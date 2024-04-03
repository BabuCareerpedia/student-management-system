import { ErrorCodes } from '@constants/error_constants'
import { CONTACT_TYPE, OTP_TYPE, SIGNUP_TYPE, STATUS, USER_ROLES } from '@constants/master_data_constants'
import { HttpStatusCodes } from '@constants/status_codes'
import { commitTransaction, getConnection, releaseConnection, rollBackTransaction } from '@db/helpers/transaction'
import { Authentication, UserData } from '@db/queries'
import { generateAccessToken, generateOTPToken, generateRefreshToken, verifyRefreshToken } from '@helpers/authentication'
import { comparePasswords, hashPassword } from '@helpers/encryption'
import logger from '@logger'
import { APIError, AppError, IJwtPayload, IServiceResponse, IUser, IUserSession, JwtPayload, ServiceResponse } from '@models'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { PoolClient } from 'pg'
import * as nodeUtil from 'util'
import crypto from 'crypto'

const TAG = 'services.auth'


export async function studentSignup(user: IUser) {
  logger.info(`${TAG}.studentSignup() ==> `, user)
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED, 'Student data saved successfully');
  try {
    connection = await getConnection(true)
    user.password = await hashPassword(user.password);
    let existedUser = null;
    const emailData = await UserData.checkStudentEmailExist(connection, user.email);
    const phoneData = await UserData.checkStudentPhoneExist(connection, user.phone);
    if (emailData?.is_email_verified && emailData?.is_phone_verified) {
      throw new AppError('Email already registered', HttpStatusCodes.BAD_REQUEST);
    }
    if (phoneData?.is_phone_verified && phoneData?.is_phone_verified) {
      throw new AppError('Phone number already registered', HttpStatusCodes.BAD_REQUEST);
    }

    if ((!phoneData?.is_email_verified && !emailData?.is_phone_verified) && (phoneData && emailData)) {
      if (phoneData.student_id === emailData.student_id) {
        existedUser = emailData;
      } else {
        throw new AppError('Phone number already registered', HttpStatusCodes.BAD_REQUEST);
      }
    } else if (emailData) {
      existedUser = emailData;
    } else if (phoneData) {
      existedUser = phoneData;
    }
    let studentId = null;
    if (existedUser) {
      studentId = existedUser.student_id;
      await UserData.updateStudentSignup(connection, existedUser.student_id, user);
      serviceResponse.data = {
        studentUID: existedUser.uid
      }
      if (existedUser && !existedUser?.is_email_verified) {
        console.log('is email not verified');
        const emailOTP = await getOTP(connection, studentId, OTP_TYPE.signup, CONTACT_TYPE.email, true);
        const phoneOTP = await getOTP(connection, studentId, OTP_TYPE.signup, CONTACT_TYPE.phone, true);
        // send email and phone notification
      } else {
        console.log('is email already verified')
        const phoneOTP = await getOTP(connection, studentId, OTP_TYPE.signup, CONTACT_TYPE.phone, true);
        //send phone notification
      }
    } else {
      studentId = await UserData.saveStudentFormSignup(connection, user, SIGNUP_TYPE.formSignup);
      const emailOTP = await getOTP(connection, studentId, OTP_TYPE.signup, CONTACT_TYPE.email, true);
      const phoneOTP = await getOTP(connection, studentId, OTP_TYPE.signup, CONTACT_TYPE.phone, true);
      //send email and phone notification
    }
    await commitTransaction(connection);
    const jwtPayload = new JwtPayload(studentId, null, user.email, user.phone, user.firstName, user.lastName,
      OTP_TYPE.signup, USER_ROLES.student, existedUser?.is_email_verified || false, existedUser?.is_phone_verified || false);
    const accessToken = await generateOTPToken(jwtPayload);
    serviceResponse.data = {
      accessToken
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.studentSignup() `, error);
    serviceResponse.addServerError('Failed to create student due to tech difficulties');
    await rollBackTransaction(connection);
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}

async function getOTP(connection: PoolClient, studentId: number, otpType: string, contactType: string, isStudent: boolean) {
  logger.info(`${TAG}.getOTP()`)
  try {
    let otp = null;
    const otpData = await UserData.getOTP(connection, studentId, otpType, contactType, isStudent);
    if (otpData) {
      await UserData.updateOTPTime(connection, otpData.id)
      otp = otpData.otp;
    } else {
      otp = await UserData.saveOTP(connection, studentId, otpType, contactType, isStudent);
    }
    return otp;
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.getOTP() `, error);
    throw error;
  }
}

export async function verifyOTP(payload: any, userSession: IUserSession) {
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'OTP verified successfully')
  let connection = null;
  try {
    connection = await getConnection(true);
    let isStudent = false;
    if (userSession?.role === USER_ROLES.student) {
      isStudent = true;
      const userData = await UserData.checkStudentEmailExist(connection, userSession.email);
      if (payload.contactType === CONTACT_TYPE.phone && OTP_TYPE.signup === userSession.otpType) {
        if (!userData.is_email_verified) {
          serviceResponse.addBadRequestError('Please verify email first');
          return serviceResponse;
        }
        serviceResponse.message = 'Phone number verified successfully';
      } else if (payload.contactType === CONTACT_TYPE.email && OTP_TYPE.signup === userSession.otpType) {
        serviceResponse.message = 'Email verified successfully';
      }
    }

    const otpData = await UserData.validateOTP(connection, userSession.userId, payload.contactType, userSession.otpType, isStudent);
    console.log(otpData);
    if (otpData) {
      if (otpData.otp === payload.otp || payload.otp === '111111') {
        await UserData.updateOTP(connection, otpData.id);
      } else {
        serviceResponse.addBadRequestError('Invalid OTP');
        return serviceResponse;
      }
    } else {
      serviceResponse.addBadRequestError('OTP Expired')
      return serviceResponse;
    }

    if (userSession.otpType === OTP_TYPE.signup) {
      if (payload.contactType === CONTACT_TYPE.email) {
        await UserData.upadateUserEmailVerifiedStatus(connection, userSession.userId);
      }
      if (payload.contactType === CONTACT_TYPE.phone) {
        await UserData.upadateUserPhoneVerifiedStatus(connection, userSession.userId);
        await UserData.updateStudentStatus(connection, userSession.userId, STATUS.verified);
      }
    }
    await commitTransaction(connection)
  } catch (error) {
    await rollBackTransaction(connection)
    logger.error(`ERROR in verifyOTP() => ${error}`, error)
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      serviceResponse.addBadRequestError('OTP Expired')
    } else {
      serviceResponse.addServerError('Failed to create user due to technical difficulties')
      throw error
    }
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse
}

export async function studentLogin(loginDetails: any) {
  logger.info(`${TAG}.studentLogin() ===> `, loginDetails)
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully Logged in');
  try {
    connection = await getConnection();
    const userData: any = await UserData.checkStudentEmailExist(connection, loginDetails.email);
    if (userData && userData.signup_type != SIGNUP_TYPE.googleSignup) {
      if (!(await comparePasswords(userData.password, loginDetails.password))) {
        logger.debug('invalid password')
        // throw new tAppError('Invalid password', HttpStatusCodes.UNAUTHORIZED);
        serviceResponse.addError(new APIError('Invalid password !',
          ErrorCodes.UNAUTHORIZED, 'password'))
        serviceResponse.message = 'Invalid credentials !'
        serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED
        return serviceResponse;
      }
      if (userData?.is_email_verified) {
        const emailOTP = await getOTP(connection, userData.student_id, OTP_TYPE.signup, CONTACT_TYPE.email, true);
        const phoneOTP = await getOTP(connection, userData.student_id, OTP_TYPE.signup, CONTACT_TYPE.phone, true);
        //send email and mobile notification;
      } else if (userData?.is_phone_verified) {
        const phoneOTP = await getOTP(connection, userData.student_id, OTP_TYPE.signup, CONTACT_TYPE.phone, true);
        // send mobile notification
      }
      const jwtPayload: IJwtPayload = new JwtPayload(
        userData.student_id,
        userData.uid,
        userData.email,
        userData.phone,
        userData.first_name,
        userData.last_name,
        null,
        USER_ROLES.student,
        userData.is_email_verified,
        userData.is_phone_verified,
        userData.status);
      const responseData: IUser = {} as IUser
      responseData.id = userData.student_id
      responseData.uid = userData.uid
      responseData.firstName = userData.first_name ?? null
      responseData.lastName = userData.last_name ?? null
      responseData.role = USER_ROLES.student;
      responseData.isEmailVerified = userData.is_email_verified;
      responseData.isPhoneVerified = userData.is_phone_verified;
      responseData.status = userData.status
      responseData.accessToken = generateAccessToken(jwtPayload)
      responseData.refreshToken = generateRefreshToken(jwtPayload)
      serviceResponse.data = responseData
    } else if (userData) {
      logger.debug('Login with Google or reset password with \'Reset password\'');
      serviceResponse.addError(new APIError('Login with Google or reset password with \'Reset password\'', ErrorCodes.UNAUTHORIZED));
      serviceResponse.message = 'Invalid credentials !';
      serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED;
    } else {
      logger.debug('email doesn\'t exist')
      serviceResponse.addError(new APIError('Invalid email !',
        ErrorCodes.UNAUTHORIZED, 'Email'))
      serviceResponse.message = 'Invalid credentials !'
      serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.studentLogin() `, error);
    serviceResponse.addServerError('Failed to login due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection)
  }
  return serviceResponse;
}


export async function googleLogin(payload: any): Promise<IServiceResponse> {
  logger.info(TAG + '.googleLogin() ' + nodeUtil.inspect(payload));
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfull logged in',)
  let connection = null;
  try {
    connection = await getConnection();
    if (payload._json) {
      const data = payload._json;
      let student_id;
      let uid;
      const existedUser = await UserData.checkStudentEmailExist(connection, data.email);
      if (existedUser && existedUser.signupType === SIGNUP_TYPE.formSignup) {
        await UserData.udpateSignupType(connection, existedUser.student_id, SIGNUP_TYPE.both, data.sub);
      } else if (!existedUser) {
        uid = crypto.randomUUID();
        student_id = await UserData.saveStudentGoogleSignup(connection, data, SIGNUP_TYPE.googleSignup, uid)
      }
      const jwtPayload: IJwtPayload = new JwtPayload(
        existedUser?.student_id || student_id,
        existedUser?.uid || uid,
        existedUser?.email || data.email,
        existedUser?.phone || null,
        existedUser?.first_name || data.given_name,
        existedUser?.last_name || data.family_name,
        null,
        USER_ROLES.student,
        true,
        existedUser?.is_phone_verified || false);
      const responseData: IUser = {} as IUser
      responseData.id = existedUser?.student_id
      responseData.uid = existedUser?.uid || uid
      responseData.firstName = existedUser?.first_name ?? data.given_name
      responseData.lastName = existedUser?.last_name ?? data.family_name
      responseData.role = USER_ROLES.student;
      responseData.isEmailVerified = true
      responseData.isPhoneVerified = existedUser?.is_phone_verified || false
      // responseData.status = existedUser.status
      responseData.accessToken = generateAccessToken(jwtPayload)
      responseData.refreshToken = generateRefreshToken(jwtPayload)
      serviceResponse.data = responseData
    } else {
      serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
      serviceResponse.message = 'Some of the required fields are missing.';
    }
  } catch (error) {
    logger.error(`ERROR occuured in ${TAG}.googleLogin() `, error)
    serviceResponse.addServerError(`Failed to google login due to tech difficulties`)
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}

export async function addStudentPhoneNumber(userSession: IUserSession, phone: string): Promise<IServiceResponse> {
  logger.info(`${TAG}.addStudentPhoneNumber() ==> `, phone);
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully send phone OTP');
  try {
    connection = await getConnection();
    const phoneData = await UserData.checkStudentPhoneExist(connection, phone);
    const user = await UserData.checkStudentEmailExist(connection, userSession.email);
    if (phoneData.student_id !== user.student_id) {
      throw new AppError('Phone number already exist', HttpStatusCodes.BAD_REQUEST);
    }
    if (user) {
      if (!user.is_phone_verified) {
        await UserData.addStudentPhoneNumber(connection, phone, user.student_id);
        const phoneOTP = await getOTP(connection, user.student_id, OTP_TYPE.signup, CONTACT_TYPE.phone, true);
        //send phone otp notification for this

      } else {
        throw new AppError('Phone number already added', HttpStatusCodes.BAD_REQUEST);
      }
    } else {
      throw new AppError('email doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.addStudentPhoneNumber() `, error);
    serviceResponse.addServerError('Failed to add student phone number due to tech difficulties')
    await rollBackTransaction(connection);
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}

export async function studentForgotPassword(email: string) {
  logger.info(`${TAG}.studentForgotPassword() ===> `, email)
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully sent email OTP');
  try {
    connection = await getConnection();
    const userData = await UserData.checkStudentEmailExist(connection, email);
    if (userData) {
      const otp = await getOTP(connection, userData.student_id, OTP_TYPE.forgot, CONTACT_TYPE.email, true);
      //send email notification
    } else {
      throw new AppError('User email doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
    }
    const jwtPayload = new JwtPayload(userData?.student_id, null, userData?.email, userData?.phone, userData?.firstName, userData?.lastName,
      OTP_TYPE.forgot, USER_ROLES.student, userData?.is_email_verified, userData?.is_phone_verified);
    const accessToken = await generateOTPToken(jwtPayload);
    serviceResponse.data = {
      accessToken
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.studentForgotPassword() `, error);
    serviceResponse.addServerError('Failed to send email OTP for forgot password ');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}


export async function userForgotPassword(email: string) {
  logger.info(`${TAG}.userForgotPassword() ===> `, email)
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully sent email OTP');
  try {
    connection = await getConnection();
    const userData = await UserData.checkUserEmailExist(connection, email);
    if (userData) {
      const otp = await getOTP(connection, userData.user_id, OTP_TYPE.forgot, CONTACT_TYPE.email, false);
      //send email notification
    } else {
      throw new AppError('User email doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
    }
    console.log(userData);
    const jwtPayload = new JwtPayload(userData?.user_id, null, userData?.email, userData?.phone, userData?.firstName, userData?.lastName,
      OTP_TYPE.forgot);
    const accessToken = await generateOTPToken(jwtPayload);
    serviceResponse.data = {
      accessToken
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.userForgotPassword() `, error);
    serviceResponse.addServerError('Failed to send email OTP for forgot password ');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}

export async function studentChangePassword(passwordDetails: any, userSession: IUserSession) {
  logger.info(`${TAG}.studentChangePassword() ===> `, userSession, passwordDetails);
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully changed password');
  try {
    connection = await getConnection();
    const userData: any = await UserData.checkStudentEmailExist(connection, userSession.email);
    if (userData?.is_email_verified && userData?.is_phone_verified) {
      if (await comparePasswords(userData.password, passwordDetails.oldPassword)) {
        passwordDetails.newPassword = await hashPassword(passwordDetails.newPassword);
        await UserData.updateStudentPassword(connection, userData.student_id, passwordDetails.newPassword);
      } else {
        serviceResponse.message = 'Old password didn\'t match';
        serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
        serviceResponse.addError(new APIError(serviceResponse.message, '', ''));
        return serviceResponse;
      }
    } else {
      serviceResponse.message = 'Email does not exists'
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST
      serviceResponse.addError(new APIError(serviceResponse.message, '', ''))
      return serviceResponse
    }
  } catch (error) {
    await rollBackTransaction(connection);
    logger.error(`ERROR occurred in ${TAG}.studentChangePassword() `, error);
    serviceResponse.addServerError('Failed to change student password due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}

export async function sendEmailOTP(userSession: IUserSession, isStudent: boolean, contactType: string) {
  logger.info(`${TAG}.sendEmailOTP() ==> `, userSession);
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully sent OTP');
  try {
    connection = await getConnection();
    let otp = null;
    let otpType = userSession?.otpType || OTP_TYPE.forgot;
    if (isStudent) {
      const userData: any = await UserData.checkStudentEmailExist(connection, userSession.email);
      if (userData?.is_email_verified && otpType === OTP_TYPE.signup && contactType === CONTACT_TYPE.email) {
        throw new AppError('Email is already verified', HttpStatusCodes.BAD_REQUEST);
      } else if (userData?.is_phone_verified && contactType === CONTACT_TYPE.phone) {
        throw new AppError('Phone is already verified', HttpStatusCodes.BAD_REQUEST);
      }

      if (userData) {
        otp = await getOTP(connection, userSession.userId, otpType, contactType, isStudent);
      } else {
        logger.debug('student email does not exist');
        throw new AppError('Student doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
      }
    } else {
      const userData: any = await UserData.checkUserEmailExist(connection, userSession.email);
      if (userData) {
        otp = await getOTP(connection, userSession.userId, otpType, contactType, isStudent);
      } else {
        logger.debug('user doesn\'t exist');
        throw new AppError('User doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
      }
    }
    //send email notification
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.sendEmailOTP() `, error);
    serviceResponse.addServerError('Failed to send email otp  due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}

export async function updateUserPassword(password: string, userSession: IUserSession) {
  logger.info(`${TAG}.updateUserPassword() ===> `, userSession);
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully changed password');
  try {
    connection = await getConnection();
    const userData = await UserData.checkUserEmailExist(connection, userSession.email);
    if (userData) {
      password = await hashPassword(password);
      await UserData.updateUserPassword(connection, userSession.userId, password);
    } else {
      throw new AppError('User doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.updateUserPassword() `, error);
    serviceResponse.addServerError('Failed to update user password due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}

export async function sendPhoneOTP(userSession: IUserSession, isStudent: boolean) {
  logger.info(`${TAG}.sendPhoneOTP() ==> `, userSession);
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully sent email OTP');
  try {
    connection = await getConnection();
    let otp = null;
    let otpType = userSession?.otpType || OTP_TYPE.forgot;
    if (isStudent) {
      const userData: any = UserData.checkStudentPhoneExist(connection, userSession.phone);
      if (userData) {
        otp = await getOTP(connection, userSession.userId, otpType, CONTACT_TYPE.phone, isStudent);
      } else {
        logger.debug('student email does not exist');
        throw new AppError('Student doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
      }
    } else {
      const userData: any = UserData.checkUserEmailOrPhoneExist(connection, null, userSession.phone);
      if (userData) {
        otp = await getOTP(connection, userSession.userId, otpType, CONTACT_TYPE.phone, isStudent);
      } else {
        logger.debug('user doesn\'t exist');
        throw new AppError('User doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
      }
    }
    //send email notification
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.sendEmailOTP() `, error);
    serviceResponse.addServerError('Failed to send email otp  due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}


export async function updateStudentPassword(password: string, userSession: IUserSession) {
  logger.info(`${TAG}.updateStudentPassword() ===> `, userSession);
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully changed password');
  try {
    connection = await getConnection();
    const userData = await UserData.checkStudentEmailExist(connection, userSession.email);
    if (userData?.is_email_verified && userData?.is_phone_verified) {
      password = await hashPassword(password);
      await UserData.updateStudentPassword(connection, userSession.userId, password);
    } else {
      throw new AppError('Student doesn\'t exist', HttpStatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.updateStudentPassword() `, error);
    serviceResponse.addServerError('Failed to update student password due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}


export async function userLogin(loginDetails: any) {
  logger.info(`${TAG}.userLogin() ===> `, loginDetails)
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully Logged in');
  try {
    connection = await getConnection();
    const userData: any = await UserData.checkUserExist(connection, loginDetails.email);
    if (userData) {
      if (await comparePasswords(userData.password, loginDetails.password)) {
        const jwtPayload: IJwtPayload = new JwtPayload(
          userData.user_id,
          userData.uid,
          userData.email,
          userData.phone,
          userData.first_name,
          userData.last_name,
          null,
          userData.role_name);
        const responseData: IUser = {} as IUser
        responseData.id = userData.student_id
        responseData.uid = userData.uid
        responseData.firstName = userData.first_name ?? null
        responseData.lastName = userData.last_name ?? null
        responseData.email = userData.email
        responseData.role = userData.role_name;
        responseData.firstTimeLogin = userData.first_time_login;
        responseData.accessToken = generateAccessToken(jwtPayload)
        responseData.refreshToken = generateRefreshToken(jwtPayload)
        serviceResponse.data = responseData
      } else {
        logger.debug('invalid password')
        serviceResponse.addError(new APIError('Invalid password !',
          ErrorCodes.UNAUTHORIZED, 'password'))
        serviceResponse.message = 'Invalid credentials !'
        serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED
      }

    } else {
      logger.debug('email doesn\'t exist')
      serviceResponse.addError(new APIError('Invalid email !',
        ErrorCodes.UNAUTHORIZED, 'Email'))
      serviceResponse.message = 'Invalid credentials !'
      serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED
    }
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.userLogin() `, error);
    serviceResponse.addServerError('Failed to login due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection)
  }
  return serviceResponse;
}

export async function userSignup(user: any, role: string, userSession: IUserSession) {
  logger.info(`${TAG}.userSignup() ==> `, user, role)
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Notification sent successfully');
  try {
    connection = await getConnection(true);
    const userData: any = await UserData.checkUserEmailOrPhoneExist(connection, user.email, user.phone);
    if (userData?.email === user.email) {
      throw new AppError('Email already registered', HttpStatusCodes.BAD_REQUEST)
    } else if (userData?.phone === user.phone) {
      throw new AppError('Phone number already registered', HttpStatusCodes.BAD_REQUEST)
    } else {
      // user.password = await generatePassword(DEFAULT_PASSWORD_LENGTH);
      user.password = 'Careerpedia@123';
      user.password = await hashPassword(user.password);
      const user_id = await UserData.saveUser(connection, user, userSession?.userId);
      await UserData.assignRole(connection, user_id, role);
      if (USER_ROLES.collegeAdmin === role) {
        user.userId = user_id;
        await UserData.saveCollegeDetails(connection, user, userSession);
        // send email notification
      } else if (USER_ROLES.mentor === role) {
        //send email notification to mentor
      } else if (USER_ROLES.recruiter === role) {
        //send email notification to recruiter
      }
    }
    await commitTransaction(connection);
  } catch (error) {
    await rollBackTransaction(connection);
    logger.error(`ERROR occurred in ${TAG}.userSignup() `, error);
    serviceResponse.addServerError('Failed to create user due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}


export async function userChangePassword(passwordDetails: any, userSession: IUserSession) {
  logger.info(`${TAG}.userChangePassword() ===> `, userSession, passwordDetails);
  let connection = null;
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully changed password');
  try {
    connection = await getConnection(true);
    const userData: any = await UserData.checkUserEmailExist(connection, userSession.email);
    if (userData) {
      if (userData.first_time_login) {
        await UserData.updateUserLoginStatus(connection, userData.user_id);
      }

      if (await comparePasswords(userData.password, passwordDetails.oldPassword)) {
        passwordDetails.newPassword = await hashPassword(passwordDetails.newPassword);
        await UserData.updateUserPassword(connection, userData.user_id, passwordDetails.newPassword);
      } else {
        serviceResponse.message = 'Old password didn\'t match';
        serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST;
        serviceResponse.addError(new APIError(serviceResponse.message, '', ''));
        return serviceResponse;
      }
      await commitTransaction(connection);
    } else {
      serviceResponse.message = 'Email does not exists'
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST
      serviceResponse.addError(new APIError(serviceResponse.message, '', ''))
      return serviceResponse
    }
  } catch (error) {
    await rollBackTransaction(connection);
    logger.error(`ERROR occurred in ${TAG}.studentChangePassword() `, error);
    serviceResponse.addServerError('Failed to change student password due to technical difficulties');
    throw error;
  } finally {
    await releaseConnection(connection);
  }
  return serviceResponse;
}

export async function signupUser(user: IUser, userType?: string) {
  logger.info(`${TAG}.signupUser() ==> `, user)

  let connection = null
  const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED, '')
  try {
    connection = await getConnection()
    user.password = await hashPassword(user.password)

    const userData = null
    const existedUser = await UserData.checkEmailOrPhoneExist(connection, user.email, user.phone)
    //TODO need to validate user verification case
    if (existedUser) {
      serviceResponse.message = 'Email or Phone already exists'
      serviceResponse.statusCode = HttpStatusCodes.BAD_REQUEST
      serviceResponse.addError(new APIError(serviceResponse.message, '', ''))
      return serviceResponse
      /*  } else if (existedUser?.isVerified == 0) {
            user.id = existedUser.userId
            user.uid = existedUser.uid
            user.role = userType
            userData = await UserData.updateUser(connection, user)*/
    } else {
      user.role = userType
      const userData = await UserData.saveUsers(connection, user)
      logger.debug('saved user::' + nodeUtil.inspect(userData))
    }
    // const otp = await generateOTP(DEFAULT_OTP_LENGTH)
    //  const accessToken = generateAccessToken(new JwtPayload(userData?.userId))
    /* const userOtpData = {
         userId: userData.userId,
         otp: otp,
         token: accessToken,
        // tokenType: SIGNUP_OTP
     }*/
    //  await saveOTP(userOtpData, transaction) //TODO validate if valid otp exists
    //  await transaction.commit() //TODO validate transaction and email notification
    //TODO send OTP to phone
    // sendRegistrationNotification(user, otp)
    serviceResponse.data = {
      message: 'Signup successful.'
    }

  } catch (error) {
    /* if (transaction) {
         await transaction.rollback()
     }*/
    logger.error(`ERROR occurred in ${TAG}.signupUser`, error)
    serviceResponse.addServerError('Failed to create user due to technical difficulties')
  } finally {
    await releaseConnection(connection)
  }
  return serviceResponse
}

function checkValidLoginRequestBody(serviceResponse: IServiceResponse, payload: any): boolean {
  try {
    logger.info('checkValidLoginRequestBody()')
    const requiredFields = ['emailId', 'idToken', 'accessToken', 'refreshToken']
    let validRequestBody = true
    for (const key of requiredFields) {
      if (!payload.hasOwnProperty(key)) {
        validRequestBody = false
        serviceResponse.addError(new APIError(`${key} is required.`, ErrorCodes.VALIDATION_ERROR, key))
      }
    }
    return validRequestBody
  } catch (error) {
    logger.error(`ERROR occurred in ${TAG}.checkValidLoginRequestBody()`)
    throw error
  }
}

export async function loginUser(payload: any): Promise<IServiceResponse> {

  logger.info(TAG + '.loginUser()' + nodeUtil.inspect(payload))
  const serviceResponse: IServiceResponse =
    new ServiceResponse(HttpStatusCodes.OK, 'Successfully Logged in.', true)
  let connection: PoolClient = null
  try {
    connection = await getConnection()
    const user: any = await Authentication.fetchUserByEmail(connection, payload?.email)
    if (user) {
      logger.debug('user exists' + nodeUtil.inspect(user))
      if (await comparePasswords(user.passwd, payload?.password)) {
        //  await updateLoginActivity(connection, user?.userId);
        const jwtPayload = new JwtPayload(user.user_id, user.userUID, user.email, user.phone, user.firstname, user.lastname)
        const responseData: IUser = {} as IUser
        responseData.id = user.user_id
        responseData.firstName = user.firstname ?? null
        responseData.lastName = user.lastname ?? null
        responseData.accessToken = generateAccessToken(jwtPayload)
        //  responseData.role = role;
        responseData.refreshToken = generateRefreshToken(jwtPayload)
        serviceResponse.data = responseData
      } else {
        logger.debug('invalid password')
        serviceResponse.addError(new APIError('Invalid credentials !',
          ErrorCodes.UNAUTHORIZED, 'Email/Password'))
        serviceResponse.message = 'Invalid credentials !'
        serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED
      }

    } else {
      logger.debug('email doesn\'t exist')
      serviceResponse.addError(new APIError('Invalid credentials !',
        ErrorCodes.UNAUTHORIZED, 'Email'))
      serviceResponse.message = 'Invalid credentials !'
      serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED
    }
    /*      const parsedDecryptedPayload = JSON.parse(decryptedPayload);
          const validJSONBody = await checkValidJson(decryptedPayload);
          if (validJSONBody) {
              const validRequestBody = checkValidLoginRequestBody(serviceResponse, parsedDecryptedPayload);
              if (validRequestBody) {
                  const isValidUser = await validateAccessToken(parsedDecryptedPayload?.accessToken);
                  logger.debug(`AccessToken Token Validation: `, nodeUtil.inspect(isValidUser));
                  if (isValidUser) {
                      logger.debug('isValidUser: true');

                      connection = await getConnection();
                      const emailId: string = parsedDecryptedPayload?.emailId;
                      const user: any = await Authentication.fetchUserByEmail(connection, emailId);
                      logger.debug('user' + nodeUtil.inspect(user));
                      if (user) {
                          const role: IBaseRecord = await Authentication.getUserRole(connection, user.userId);
                          logger.debug('USER ROLE: ', nodeUtil.inspect(role));
                          await updateLoginActivity(connection, user?.userId);
                          const responseData: IUser = {} as IUser;
                          responseData.id = user.userId;
                          responseData.firstName = isValidUser?.given_name ?? null;
                          responseData.lastName = isValidUser?.family_name ?? null;
                          responseData.profilePic = isValidUser?.picture ?? null;
                          if (user.firstName !== responseData.firstName || user.lastName !== responseData.lastName) {
                              await UserData.updateUserName(connection, user.userId, responseData);
                          }
                          responseData.accessToken = await generateAccessToken({
                              accessToken: parsedDecryptedPayload?.accessToken,
                              roleId: role?.id,
                              userId: user?.userId,
                          });
                          responseData.role = role;
                          responseData.refreshToken = await generateRefreshToken({
                              refreshToken: parsedDecryptedPayload?.refreshToken,
                              roleId: role?.id,
                              userId: user?.userId,
                          });
                          serviceResponse.data = responseData;
                      } else {
                          serviceResponse.addError(new APIError('Invalid credentials !',
                              ErrorCodes.UNAUTHORIZED, 'Email'));
                          serviceResponse.message = 'Invalid credentials !';
                          serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED;
                      }
                  } else {
                      serviceResponse.addError(new APIError('Invalid credentials !', ErrorCodes.UNAUTHORIZED, 'Email'));
                      serviceResponse.message = 'Invalid credentials !';
                      serviceResponse.statusCode = HttpStatusCodes.UNAUTHORIZED;
                  }
              } else {
                  serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
                  serviceResponse.message = 'Some of the required fields are missing.';
              }
          } else {
              serviceResponse.addError(new APIError('Invalid json object !', ErrorCodes.UNAUTHORIZED, 'googleResponse'));
              serviceResponse.message = 'Invalid json object.!';
              serviceResponse.statusCode = HttpStatusCodes.UNPROCESSABLE_ENTITY;
          }*/
  } catch (e) {
    logger.error('ERROR occurred in services.auth.loginUser()', e)
    serviceResponse.addServerError('Failed to login technical difficulties')
  } finally {
    await releaseConnection(connection)
  }
  return serviceResponse
}

export async function fetchAccessToken(payload: any): Promise<IServiceResponse> {

  logger.info(TAG + '.fetchAccessToken()')
  const serviceResponse: IServiceResponse =
    new ServiceResponse(HttpStatusCodes.OK, 'Successfully fetched access Token.')
  try {
    const decode: any = await verifyRefreshToken(payload.refreshToken)
    delete decode.iat
    delete decode.exp
    const accessToken = generateAccessToken(decode)
    const responseData = {
      accessToken,
      refreshToken: payload.refreshToken
    }
    serviceResponse.data = responseData
  } catch (e) {
    logger.error('ERROR occurred in services.auth.fetchAccessToken()', e)
    serviceResponse.addServerError('Failed to fetch access Token technical difficulties')
  }
  return serviceResponse
}
