import { HttpStatusCodes } from '@constants/status_codes'
import { commitTransaction, getConnection, releaseConnection, rollBackTransaction } from '@db/helpers/transaction'
import {  MentorProfileData} from '@db/queries'
import logger from '@logger'
import { APIError, AppError, IServiceResponse, IUserSession, ServiceResponse, UserSession } from '@models'


const TAG = 'services.mentor_profile'

 export async function saveMentorProfile(user,userSession: IUserSession) {
    logger.info(`${TAG}.saveMentorProfile() ==> `, user)
    let connection = null;
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.CREATED, 'mentor profile data saved successfully');
    try {
      const userId = userSession.userId
      connection = await getConnection(true)
      let existUser = await MentorProfileData.checkUserIdExist(connection,userId)
      if(!existUser){
        throw new AppError('invaild user', HttpStatusCodes.BAD_REQUEST);
      }
      const existingPersonalDetails = await MentorProfileData.checkUserPersonalDetailsExist(connection,userSession.userId)
      if(existingPersonalDetails){
        const updatedPersonalDataResponse = await MentorProfileData.updateUserPersonalDetails(connection,user,userId);
        const updatedAddressDataResponse = await MentorProfileData.updateUserAddressDetails(connection,user,userId);
        const updatedEducationDataResponse = await MentorProfileData.updateUserEducationDetails(connection,user,userId)
        const updatedWorkExperienceDataResponse = await MentorProfileData.updateUserWorkExperienceDetails(connection,user,userId)

        const mentorUpdatedata ={
          updatedPersonalDataResponse,
          updatedAddressDataResponse,
          updatedEducationDataResponse,
          updatedWorkExperienceDataResponse
        }

        serviceResponse.data = mentorUpdatedata
        serviceResponse.message = "mentor profile data successfully updated !"
      } 
      else{
        const personalData = await MentorProfileData.saveUserPersonalDetails(connection,user,userSession.userId)
        const addressData = await MentorProfileData.saveUserAddressDetails(connection,user,userSession.userId)
        const educationData = await MentorProfileData.saveUserEducationDetails(connection,user,userSession.userId)
        const experienceData = await MentorProfileData.saveUserWorkExperienceDetails(connection,user,userSession.userId)

        const data = {
          personalData,
          addressData,
          educationData,
          experienceData
        }
        serviceResponse.data = {
            mentorProfileDetails:data
          }
      }
      await commitTransaction(connection);
  
    } catch (error) {
      logger.error(`ERROR occurred in ${TAG}.saveMentorProfile() `, error);
      serviceResponse.addServerError('Failed to save mentor profile details due to tech difficulties');
      await rollBackTransaction(connection);
      throw error;
    } finally {
      await releaseConnection(connection);
    }
    return serviceResponse;
  }

export async function fetchMentorProfile(userSession: IUserSession) {
    logger.info(`${TAG}.fetchMentorProfile() ==> `, userSession)
    let connection = null;
    const serviceResponse: IServiceResponse = new ServiceResponse(HttpStatusCodes.OK, 'Successfully fetched mentor profile details');
    try {
      const userId = userSession.userId
      connection = await getConnection()
      let existUser = await MentorProfileData.checkUserIdExist(connection,userId)
      if(!existUser){
        throw new AppError('invaild user', HttpStatusCodes.BAD_REQUEST);   
      }
      const existingPersonalDetails = await MentorProfileData.checkUserPersonalDetailsExist(connection,userSession.userId)
      if(existingPersonalDetails){
        const personalDetails = await MentorProfileData.fetchPersonalDetails(connection,userId);
        const addressDetails = await MentorProfileData.fetchAddressDetails(connection,userId);
        const educationDetails = await MentorProfileData.fetchEducationDetails(connection,userId);
        const workExperienceDetails = await MentorProfileData.fetchWorkExperienceDetails(connection,userId)

        const fetchmentordata ={
          personalDetails,
          addressDetails,
          educationDetails,
          workExperienceDetails
        }
        serviceResponse.data = fetchmentordata
        await commitTransaction(connection)
      }
      else{
        serviceResponse.data = null
      }
    } catch (error) {
      logger.error(`ERROR occurred in ${TAG}.fetchMentorProfile() `, error);
      serviceResponse.addServerError('Failed to fetch the mentor profile due to tech difficulties');
      throw error;
    } finally {
      await releaseConnection(connection);
    }
    return serviceResponse;
  }