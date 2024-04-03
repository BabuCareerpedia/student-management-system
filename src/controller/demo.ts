import { NextFunction, Response } from 'express';
import { responseBuilder } from '@helpers/response_builder';
import log from '@logger';
import { IServiceResponse, IUserSession } from '@models';
import  * as demo from '@service/demo'




const TAG = 'controller.profile';

export async function saveMentorProfileDetails(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.saveMentorProfileDetails()`);
        log.debug(`profile object = ${JSON.stringify(req.body)}`);
        const user = req.body
        const profileResposne: IServiceResponse = await demo.userService(user);
        responseBuilder(profileResposne, res, next, req);
    } catch (error) {
        log.error(`ERROR occurrred in ${TAG}.saveMentorProfileDetails()`, error);
        next(error);
    }
}
