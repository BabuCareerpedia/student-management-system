import { NextFunction, Response } from 'express';
import { responseBuilder } from '@helpers/response_builder';
import log from '@logger';
import { IServiceResponse, IUserSession } from '@models';
import * as mentorService from '@service/mentor';


const TAG = 'controller.profile';

export async function saveMentorProfileDetails(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.saveMentorProfileDetails()`);
        log.debug(`profile object = ${JSON.stringify(req.body)}`);
        const user = req.body
        const userSession : IUserSession = req.userSession
        const profileResposne: IServiceResponse = await mentorService.saveMentorProfile(user,userSession);
        responseBuilder(profileResposne, res, next, req);
    } catch (error) {
        log.error(`ERROR occurrred in ${TAG}.saveMentorProfileDetails()`, error);
        next(error);
    }
}

export async function fetchMentorProfileDetails(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        log.info(TAG + `.fetchMentorProfileDetails()`);
        const userSession : IUserSession = req.userSession
        const profileResposne: IServiceResponse = await mentorService.fetchMentorProfile(userSession);
        responseBuilder(profileResposne, res, next, req);
    } catch (error) {
        log.error(`ERROR occurrred in ${TAG}.fetchMentorProfileDetails()`, error);
        next(error);
    }
}