import { AUTHENTICATION } from '@constants/app_defaults';
import { ErrorCodes, ErrorMessages } from '@constants/error_constants';
import { USER_ROLES } from '@constants/master_data_constants';
import { HttpStatusCodes } from '@constants/status_codes';
import { verifyAccessToken } from '@helpers/authentication';
import { responseBuilder } from '@helpers/response_builder';
import logger from '@logger';
import { APIError, JwtPayload, ServiceResponse, UserSession } from '@models';
import { NextFunction, Response } from 'express';
import * as nodeUtil from 'util';

const TAG = 'middleware.authentication';
export function isAuthenticated(
  req: any,
  res: Response,
  next: NextFunction
): void {
  if (AUTHENTICATION.enabled) {
    logger.info(`${TAG}.isAuthenticated()`)
    let token = null
    if (
      req.headers.authorization != null &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.query?.token != null) {
      token = req.query.token
    }
    try {
      if (token === null) {
        logger.debug('TOKEN is missing!')
        const response = new ServiceResponse(
          HttpStatusCodes.UNAUTHORIZED,
          'Token Required.',
          null,
          [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
        )
        return responseBuilder(response, res, next, req)
      }
      const decodedToken: JwtPayload = verifyAccessToken(token)
      req.userSession = new UserSession(
        decodedToken.userId,
        decodedToken.userUID,
        decodedToken.email,
        decodedToken.phone,
        decodedToken.role,
        null,
        decodedToken.otpType,
        decodedToken.isEmailVerified,
        decodedToken.isPhoneVerified
      )
      console.log(req.userSession);
      //  req.tokenType = decodedToken.tokenType
      logger.debug('LOGGED IN USER:' + nodeUtil.inspect(req.userSession))
      next()
    } catch (error) {
      logger.error('ERROR occurred in isAuthenticated() ', error)
      let response = new ServiceResponse(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.INTERNAL_SERVER_ERROR,
        true,
        [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
      )
      if (error?.message === 'jwt expired') {
        response = new ServiceResponse(
          HttpStatusCodes.UNAUTHORIZED,
          ErrorMessages.SESSION_EXPIRED,
          true,
          [new APIError('Token expired.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
        )
      } else if (error?.message === 'invalid signature' || error?.message === 'invalid token') {
        response = new ServiceResponse(
          HttpStatusCodes.UNAUTHORIZED,
          ErrorMessages.INVALID_FIELD.replace('$field', 'Token'),
          true,
          [new APIError('Invalid token.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
        )
      }
      responseBuilder(response, res, next, req)
    }
  } else {
    next()
  }
}
export function isAdmin(req: any, res: Response, next: NextFunction): void {
  if (AUTHENTICATION.enabled) {
    logger.info(`${TAG}.isAdmin()`)
    let token = null
    if (
      req.headers.authorization != null &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.query?.token != null) {
      token = req.query.token
    }
    try {
      if (token === null) {
        logger.debug('TOKEN is missing!')
        const response = new ServiceResponse(
          HttpStatusCodes.UNAUTHORIZED,
          'Token Required.',
          null,
          [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
        )
        return responseBuilder(response, res, next, req)
      }
      const decodedToken: JwtPayload = verifyAccessToken(token)
      if (decodedToken?.role === USER_ROLES.admin) {
        req.userSession = new UserSession(
          decodedToken.userId,
          null,
          decodedToken.email,
          null,
          decodedToken.role
        )
        // req.tokenType = decodedToken.tokenType
        logger.debug('LOGGED IN USER:' + nodeUtil.inspect(req.userSession))
        next()
      } else {
        const response = new ServiceResponse(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          ErrorMessages.INTERNAL_SERVER_ERROR,
          true,
          [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
        )
        responseBuilder(response, res, next, req)
      }
    } catch (error) {
      logger.error('ERROR occurred in isAuthenticated() ', error)
      let response = new ServiceResponse(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.INTERNAL_SERVER_ERROR,
        true,
        [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
      )
      if (error?.message === 'jwt expired') {
        response = new ServiceResponse(
          HttpStatusCodes.UNAUTHORIZED,
          ErrorMessages.SESSION_EXPIRED,
          true,
          [new APIError('Token expired.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
        )
      } else if (error?.message === 'invalid signature') {
        response = new ServiceResponse(
          HttpStatusCodes.UNAUTHORIZED,
          ErrorMessages.INVALID_FIELD.replace('$field', 'Token'),
          true,
          [new APIError('Invalid token.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
        )
      }
      responseBuilder(response, res, next, req)
    }
  } else {
    next()
  }
}

export function isUser(userTypes: string[]) {
  return (req: any, res: Response, next: NextFunction): void => {
    if (AUTHENTICATION.enabled) {
      logger.info(`${TAG}.isUser(): ${userTypes}`)
      let token = null
      if (
        req.headers.authorization != null &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        token = req.headers.authorization.split(' ')[1]
      } else if (req.query?.token != null) {
        token = req.query.token
      }
      try {
        if (token === null) {
          logger.debug('TOKEN is missing!')
          const response = new ServiceResponse(
            HttpStatusCodes.UNAUTHORIZED,
            'Token Required.',
            null,
            [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
          )
          return responseBuilder(response, res, next, req)
        }
        const decodedToken: any = verifyAccessToken(token)
        logger.debug('decodedToken:' + nodeUtil.inspect(decodedToken))
        if (userTypes == null || userTypes === undefined || userTypes.includes(decodedToken?.role)) {
          req.userSession = new UserSession(
            decodedToken.userId,
            decodedToken.userUID,
            decodedToken.email,
            decodedToken.phone,
            decodedToken.role
          )
          req.tokenType = decodedToken.tokenType
          logger.debug('LOGGED IN USER:' + nodeUtil.inspect(req.userSession))
          logger.debug('Allowed userTypes:' + nodeUtil.inspect(userTypes))
          next()
        } else {
          const response = new ServiceResponse(
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.INTERNAL_SERVER_ERROR,
            true,
            [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
          )
          responseBuilder(response, res, next, req)
        }
      } catch (error) {
        logger.error('ERROR occurred in isAuthenticated() ', error)
        let response = new ServiceResponse(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          ErrorMessages.INTERNAL_SERVER_ERROR,
          true,
          [new APIError('Token required.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
        )
        if (error?.message === 'jwt expired') {
          response = new ServiceResponse(
            HttpStatusCodes.UNAUTHORIZED,
            ErrorMessages.SESSION_EXPIRED,
            true,
            [new APIError('Token expired.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
          )
        } else if (error?.message === 'invalid signature') {
          response = new ServiceResponse(
            HttpStatusCodes.UNAUTHORIZED,
            ErrorMessages.INVALID_FIELD.replace('$field', 'Token'),
            true,
            [new APIError('Invalid token.', ErrorCodes.UNAUTHORIZED, 'jwtToken')]
          )
        }
        responseBuilder(response, res, next, req)
      }
    } else {
      next()
    }
  }
}
