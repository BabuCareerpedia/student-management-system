import {ErrorCodes} from '@constants/error_constants';
import {HttpStatusCodes} from '@constants/status_codes';
import {Authentication, UserData} from '@db/queries';
import { getConnection, handleTransaction, releaseConnection } from '@db/helpers/transaction'
import {hashPassword} from '@helpers/encryption'
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from '@helpers/authentication';
import {decryptString} from '@helpers/encryption';
import logger from '@logger';
import {APIError, IBaseRecord, IServiceResponse, IUser, IUserSession, ServiceResponse} from '@models';
import {PoolClient} from 'pg';
import * as nodeUtil from 'util';
import {checkValidJson} from '@utils/string';

const TAG = 'services.user';

export async function getUserDetails(userSession: IUserSession, userId?: string) {
    logger.info(`${TAG}.getUserDetails() ==> `, userId)

    let connection = null
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED, '', false)
    try {
        connection = await getConnection();

        const userData  = await UserData.fetchUserDetails(connection, userId)

        serviceResponse.data = userData

    } catch (error) {

        logger.error(`ERROR occurred in ${TAG}.getUserDetails`, error)
        serviceResponse.addServerError('Failed to get user due to technical difficulties')
    }finally {
        await releaseConnection(connection);
    }
    return serviceResponse
}
