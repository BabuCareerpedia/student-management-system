import logger from '@logger'
import Ajv, {  ErrorObject, ValidateFunction } from 'ajv'
import addFormats from "ajv-formats"
import { NextFunction } from 'express'
import { AppError } from '@models'
import * as nodeUtil from 'util'
const ajValidator = new Ajv({allErrors: true})


addFormats(ajValidator)

export function compile(modelSchema: any): ValidateFunction  {
  return ajValidator.compile(modelSchema);
}

  async function parseErrors(validationErrors?: ErrorObject[]|null|undefined) {
  const errors: any[] = [];
  validationErrors?.forEach(error => {
    errors.push({
      target: error.instancePath? error.instancePath.substring(1): 'NA',
      message: error.message
   //  code: 400
    });
  });

  return errors;
}

export async function processErrors(payload: any, validator: ValidateFunction, next : NextFunction){
  const result =  validator(payload);
  if (!result) {
   // logger.debug(nodeUtil.inspect(validator.errors))
    const errors = await parseErrors(validator.errors);
    next( new AppError("Validation failed","400", errors));
  }else{
    next();
  }

}
