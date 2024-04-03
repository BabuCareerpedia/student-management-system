//import {ErrorMessages} from 'constants/error_constants';
//import * as Joi from 'joi';
import logger from '@logger';
//import {uniqueIdentifiedValidation, validate} from './common';

const TAG = 'validations.user';

export async function getUsers(req, res, next) {
    logger.info(`${TAG}.getUsers()`);
    try {
        // const schema = Joi.object().keys({
        //     refreshToken: Joi.string().required().messages({
        //         'string.required': 'Refresh Token required.',
        //     }),
        // });
        // await validate(schema, req, res, next);
        next()
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.getUsers()`, error);
        next(error);
    }
}
export async function createUser(req, res, next) {
    logger.info(`${TAG}.getUsers()`);
    try {
        // const schema = Joi.object().keys({
        //     refreshToken: Joi.string().required().messages({
        //         'string.required': 'Refresh Token required.',
        //     }),
        // });
        // await validate(schema, req, res, next);
        next()
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.getUsers()`, error);
        next(error);
    }
}
export async function getUserDetails(req, res, next) {
    logger.info(`${TAG}.getUsers()`);
    try {
        // const schema = Joi.object().keys({
        //     refreshToken: Joi.string().required().messages({
        //         'string.required': 'Refresh Token required.',
        //     }),
        // });
        // await validate(schema, req, res, next);
        next()
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.getUsers()`, error);
        next(error);
    }
}
export async function updateUserAction(req, res, next) {
    logger.info(`${TAG}.getUsers()`);
    try {
        // const schema = Joi.object().keys({
        //     refreshToken: Joi.string().required().messages({
        //         'string.required': 'Refresh Token required.',
        //     }),
        // });
        // await validate(schema, req, res, next);
        next()
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.getUsers()`, error);
        next(error);
    }
}
export async function updateUserRole(req, res, next) {
    logger.info(`${TAG}.getUsers()`);
    try {
        // const schema = Joi.object().keys({
        //     refreshToken: Joi.string().required().messages({
        //         'string.required': 'Refresh Token required.',
        //     }),
        // });
        // await validate(schema, req, res, next);
        next()
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.getUsers()`, error);
        next(error);
    }
}
