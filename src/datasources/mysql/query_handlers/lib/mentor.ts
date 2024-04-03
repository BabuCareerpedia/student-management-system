import { fetchRecord, saveRecord, updateRecord } from '../../helpers/query_execution';
import logger from '@logger';
import {PoolClient} from 'pg';
import crypto from 'crypto'


const TAG = 'data_stores_mysql_lib_user_mentor_profile';


export async function checkUserIdExist(connection: PoolClient, userId: number) {
    logger.info(`${TAG}.checkUserIdExist() ===> `, userId);
    try {
        const query: string = `select * from user_roles where user_id = $1`
        return await fetchRecord(connection, query, [
            userId
        ])
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkUserIdExist() `, error);
        throw error;
    }
}

export async function saveUserPersonalDetails(connection, user,userId:number) {
    console.log(user)
    logger.info(`${TAG}.saveMentorProfile()`);
    try {
        const uid = crypto.randomUUID();
        user['createdBy'] = userId
        user['userId'] = userId
        console.log(user)
        const personalDetailsQuery: string = `insert into user_personal_details( uid,user_id, website, linked_in, date_of_birth, created_by)
        values($1, $2, $3, $4, $5,$6) returning user_personal_details_id`
        const personalDetails = await saveRecord(connection, personalDetailsQuery, [
            uid,
            user.userId,
            user.personalDetails.website,
            user.personalDetails.linkedIn,
            user.personalDetails.dateOfBirth,
            user.createdBy
        ])
        console.log(personalDetails)
        return personalDetails?.user_personal_details_id
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveMentorProfile() `, error);
        throw error;
    }
}

export async function checkUserPersonalDetailsExist(connection: PoolClient, userId: number) {
    logger.info(`${TAG}.checkUserPersonalDetailsExist() ===> `, userId);
    try {
        const query: string = `SELECT * FROM user_personal_details WHERE user_id = $1`;
        return await fetchRecord(connection, query, [userId]);
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkUserPersonalDetailsExist() `, error);
        throw error;
    }
}


export async function updateUserPersonalDetails(connection: PoolClient, user, userId: number) {
    logger.info(`${TAG}.updateUserPersonalDetails()`,user);
    try {
         user['updatedBy'] = userId
        const query: string = 'update user_personal_details set website= $1 , linked_in=$2, date_of_birth= $3, updated_by=$4, updated_at= now() where user_id = $5';
     const personalDetails =  await updateRecord(connection, query, [
            user.personalDetails.website,   
            user.personalDetails.linkedIn,  
            user.personalDetails.dateOfBirth,  
            user.updatedBy,  
            userId
        ])
        return personalDetails;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserPersonalDetails() `, error);
        throw error;
    }
}


export async function saveUserAddressDetails(connection, user,userId:number) {
    console.log(user)
    logger.info(`${TAG}.saveUserAddressDetails()`);
    try {
        const uid = crypto.randomUUID();
        user['createdBy'] = userId
        user['userId'] = userId
        console.log(user)
        const addressDetailsQuery: string = `insert into user_address_details( uid,user_id, address, state, city, pincode,district,country,created_by)
        values($1, $2, $3, $4, $5,$6,$7,$8,$9) returning user_address_details_id`
        const addressDetails = await saveRecord(connection, addressDetailsQuery, [
            uid,
            user.userId,
            user.addressDetails.address ,
            user.addressDetails.state ,
            user.addressDetails.city ,
            user.addressDetails.pincode ,
            user.addressDetails.district,
            user.addressDetails.country ,
            user.createdBy
        ])
        console.log(addressDetails)
        return addressDetails?.user_address_details_id;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveUserAddressDetails() `, error);
        throw error;
    }
}

export async function updateUserAddressDetails(connection: PoolClient, user, userId: number) {
    logger.info(`${TAG}.updateUserAddressDetails()`,user);
    try {
         user['updatedBy'] = userId
        const query: string = 'update user_address_details set address= $1 , state=$2, city= $3, pincode=$4, district=$5, country=$6 , updated_by=$7 , updated_at= now() where user_id= $8';
        const addressDetails = await updateRecord(connection, query, [
            user.addressDetails.address,
            user.addressDetails.state,
            user.addressDetails.city,
            user.addressDetails.pincode,
            user.addressDetails.district,
            user.addressDetails.country,
            user.updatedBy,
            userId
        ])
        return addressDetails;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserAddressDetails() `, error);
        throw error;
    }
}

export async function saveUserEducationDetails(connection, user,userId:number) {
    console.log(user)
    logger.info(`${TAG}.saveUserEducationDetails()`);
    try {
        const uid = crypto.randomUUID();
        user['createdBy'] = userId
        user['userId'] = userId
        const educationDetailsQuery: string = `insert into user_education_details( uid,user_id, highest_education, department_branch, bachelors_degree,start_year,end_year, degree_percentage,created_by)
        values($1, $2, $3, $4, $5,$6,$7,$8,$9) returning user_education_details_id`
        const educationDetails = await saveRecord(connection, educationDetailsQuery, [
            uid,
            user.userId,
            user.educationDetails.highestEducation ,
            user.educationDetails.departmentBranch ,
            user.educationDetails.bachelorsDegree ,
            user.educationDetails.startYear,
            user.educationDetails.endYear,
            user.educationDetails.degreePercentage,
            user.createdBy
        ])
        return educationDetails?.user_education_details_id;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveUserEducationDetails() `, error);
        throw error;
    }
}

export async function updateUserEducationDetails(connection: PoolClient, user, userId: number) {
    logger.info(`${TAG}.updateUserEducationDetails()`,user);
    try {
         user['updatedBy'] = userId
        const query: string = 'update user_education_details set highest_education= $1 , department_branch=$2, bachelors_degree= $3, start_year=$4, end_year=$5, degree_percentage=$6 , updated_by=$7 , updated_at = now() where user_id= $8';
      const educationDetails =  await updateRecord(connection, query, [
            user.educationDetails.highestEducation,
            user.educationDetails.departmentBranch,
            user.educationDetails.bachelorsDegree,
            user.educationDetails.startYear,
            user.educationDetails.endYear,
            user.educationDetails.degreePercentage,
            user.updatedBy,
            userId
            
        ])
        return educationDetails;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserEducationDetails() `, error);
        throw error;
    }
}

export async function saveUserWorkExperienceDetails(connection, user,userId:number) {
    console.log(user)
    logger.info(`${TAG}.saveUserWorkExperienceDetails()`);
    try {
        const uid = crypto.randomUUID();
        user['createdBy'] = userId
        user['userId'] = userId
        const WorkExperienceDetailsQuery: string = `insert into user_work_experience( uid,user_id, occupation, job_role, start_date, end_date, created_by)
        values($1, $2, $3, $4, $5,$6,$7) returning user_work_experience_id`
        const workExperienceDetails = await saveRecord(connection, WorkExperienceDetailsQuery, [
            uid,
            user.userId,
            user.workExperienceDetails.occupation ,
            user.workExperienceDetails.jobRole ,
            user.workExperienceDetails.startDate ,
            user.workExperienceDetails.endDate,
            user.createdBy
        ])
        console.log(workExperienceDetails)
        return workExperienceDetails?.user_work_experience_id;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveUserWorkExperienceDetails() `, error);
        throw error;
    }
}

export async function updateUserWorkExperienceDetails(connection: PoolClient, user, userId: number) {
    logger.info(`${TAG}.updateUserWorkExperienceDetails()`,user);
    try {
         user['updatedBy'] = userId
        const query: string = 'update user_work_experience set occupation= $1 , job_role=$2, start_date= $3, end_date=$4, updated_by=$5 ,updated_at= now()where user_id= $6';
      const workExperienceDetails =  await updateRecord(connection, query, [
            user.workExperienceDetails.occupation,
            user.workExperienceDetails.jobRole,
            user.workExperienceDetails.startDate,
            user.workExperienceDetails.endDate,
            user.updatedBy,
            userId
            
        ])
        return workExperienceDetails;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserWorkExperienceDetails() `, error);
        throw error;
    }
}

export async function fetchPersonalDetails(connection: PoolClient, userId: number){
    logger.info(`${TAG}.fetchPersonalDetails()`);
    try {
        const sqlQuery = `SELECT 
        users.first_name,users.last_name,users.email,users.phone,
        user_personal_details.website,user_personal_details.linked_in,user_personal_details.date_of_birth
       FROM users JOIN user_personal_details ON users.user_id = user_personal_details.user_id
        WHERE users.user_id = $1;`;
        const dbResult = await fetchRecord(connection, sqlQuery, [userId]);
        return dbResult;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.fetchPersonalDetails()`, error);
        throw error;
    }
}

export async function fetchAddressDetails(connection: PoolClient, userId: number){
    logger.info(`${TAG}.fetchAddressDetails()`);
    try {
        const sqlQuery = `select * from user_address_details where user_id = $1`;
        const dbResult = await fetchRecord(connection, sqlQuery, [userId]);
        return dbResult;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.fetchAddressDetails()`, error);
        throw error;
    }
}

export async function fetchEducationDetails(connection: PoolClient, userId: number){
    logger.info(`${TAG}.fetchEducationDetails()`);
    try {
        const sqlQuery = `select * from user_education_details where user_id = $1`;
        const dbResult = await fetchRecord(connection, sqlQuery, [userId]);
        return dbResult;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.fetchEducationDetails()`, error);
        throw error;
    }
}

export async function fetchWorkExperienceDetails(connection: PoolClient, userId: number){
    logger.info(`${TAG}.fetchWorkExperienceDetails()`);
    try {
        const sqlQuery = `select * from user_work_experience where user_id = $1`;
        const dbResult = await fetchRecord(connection, sqlQuery, [userId]);
        return dbResult;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.fetchWorkExperienceDetails()`, error);
        throw error;
    }
}


