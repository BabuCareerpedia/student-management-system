import { HttpStatusCodes } from '@constants/status_codes'
import { commitTransaction, getConnection, releaseConnection, rollBackTransaction } from '@db/helpers/transaction'
import {  UserDemo} from '@db/queries'
import logger from '@logger'
import { APIError, AppError, IServiceResponse, IUserSession, ServiceResponse, UserSession } from '@models'


const TAG = "USER_DEMO_SERVICES"

export async function userService(user:any) {
    logger.info(`${TAG}.saveUser() ==> `, user)
    let connection = null;
    console.log("jcjbsdbckahhhhhhhhhh")
    console.log(user)
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED, 'user data saved successfully');
    try{
      connection = await getConnection(true)
        const userData = await UserDemo.saveUserDetails(user,connection)
        console.log(userData)
        const data = {
          userData
        }
        serviceResponse.data= data
        await commitTransaction(connection);
    }catch (error) {
      logger.error(`ERROR occurred in ${TAG}.fetchMentorProfile() `, error);
      serviceResponse.addServerError('Failed to fetch the mentor profile due to tech difficulties');
      throw error;
    } 
    return serviceResponse;
}

