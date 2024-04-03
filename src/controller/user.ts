import {NextFunction, Response} from 'express';
import {responseBuilder} from '@helpers/response_builder';
import log from '@logger';
import {IBaseListAPIRequest, IServiceResponse, IUser} from '@models';
import * as UserService from '@service/user';
import nodeUtil from 'util';

const TAG = 'controller.user';


export async function getUserDetails(req: any, res: Response, next: NextFunction): Promise<void> {
    log.info(`${TAG}.getUserDetails`);
    try {
        const {userId} = req.params;
        log.debug(`LOGGED IN USER: ${nodeUtil.inspect(req.userSession)}`);

        const userResponse: IServiceResponse = await UserService.getUserDetails(req.userSession, userId);
        responseBuilder(userResponse, res, next, req);
    } catch (error) {
        log.error(`ERROR occurred in ${TAG}.getUserDetails`, error);
        next(error);
    }
}
