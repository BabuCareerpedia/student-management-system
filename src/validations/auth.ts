import logger from '@logger';
import {compile, processErrors} from './ajv_helper'
import {body} from './schemas/auth'

const loginValidator=compile( body );
//import {ErrorMessages} from 'constants/error_constants';
//import * as Joi from 'joi';
//import {uniqueIdentifiedValidation, validate} from './common';

const TAG = 'validations.auth';

export async function validateLogin(req, res, next){
    logger.info(`${TAG}.validateLogin()`);
    return await processErrors(req.body, loginValidator, next)

}
export async function getAccessToken(req, res, next) {
    logger.info(`${TAG}.getAccessToken()`);
    try {
        // const schema = Joi.object().keys({
        //     refreshToken: Joi.string().required().messages({
        //         'string.required': 'Refresh Token required.',
        //     }),
        // });
        // await validate(schema, req, res, next);
        next()
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.getUserDetails()`, error);
        next(error);
    }
}
