import { DEFAULT_OTP_LENGTH } from '@config';
import { SIGNUP_TYPE, STATUS } from '@constants/master_data_constants';
import logger from '@logger';
import { IUser, IUserSession } from '@models';
import { generateOTP } from '@utils/string';
import crypto from 'crypto';
import { PoolClient } from 'pg';
import * as nodeUtil from 'util';
import { fetchRecord, saveRecord, updateRecord } from '../../helpers/query_execution';
import { getUserFromUserTbl } from '../table_model_mappers/user';

const TAG = 'data_stores_mysql_lib_user';


export async function checkStudentEmailExist(connection: PoolClient, email: string) {
    logger.info(`${TAG}.checkStudentEmailExist() ===> `, email);
    try {
        const query: string = `select * from student where email = $1`
        return await fetchRecord(connection, query, [
            email
        ])
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkStudentEmailExist() `, error);
        throw error;
    }
}

export async function addStudentPhoneNumber(connection: PoolClient, phone: string, studentId: number) {
    logger.info(`${TAG}.addStudentPhoneNumber() ===> `, phone);
    try {
        const query: string = `update student set phone = $1 where student_id = $2`;
        return await updateRecord(connection, query, [phone, studentId])
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.addStudentPhoneNumber() `, error);
        throw error;
    }
}
export async function checkUserEmailExist(connection: PoolClient, email: string) {
    logger.info(`${TAG}.checkUserEmailExist() ===> `, email);
    try {
        const query: string = 'select * from users where email = $1;';
        const user = await fetchRecord(connection, query, [email]);
        return user;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkUserEmailExist() `, error);
        throw error;
    }
}

export async function checkStudentPhoneExist(connection: PoolClient, phone: string) {
    logger.info(`${TAG}.checkStudentPhoneExist() ===> `, phone);
    try {
        const query: string = 'select * from student where phone = $1;';
        const user = await fetchRecord(connection, query, [phone]);
        return user;
    } catch (errorr) {
        logger.error(`ERROR occurred in ${TAG}.checkStudentPhoneExist() `, errorr);
        throw errorr;
    }
}

export async function saveStudentFormSignup(connection, user: IUser, signupType: string) {
    logger.info(`${TAG}.saveStudentSignup()`);
    try {
        const uid = crypto.randomUUID();
        const query: string = `insert into student( uid, first_name, last_name, email, phone, password, signup_type, terms_and_condition)
        values($1, $2, $3, $4, $5, $6, $7, $8) returning student_id`
        const result = await saveRecord(connection, query, [
            uid,
            user.firstName,
            user.lastName,
            user.email,
            user.phone,
            user.password,
            signupType,
            user.termsAndCondition
        ])
        return result?.student_id;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveStudentSignup() `, error);
        throw error;
    }
}


export async function saveStudentGoogleSignup(connection, user: any, signupType: string, uid: string) {
    logger.info(`${TAG}.saveStudentSignup()`);
    try {
        const query: string = `insert into student( uid, first_name, last_name, email,google_uuid, signup_type, terms_and_condition, is_email_verified)
        values($1, $2, $3, $4, $5, $6, $7, $8) returning student_id`
        const result = await saveRecord(connection, query, [
            uid,
            user.given_name,
            user.family_name,
            user.email,
            user.sub,
            signupType,
            true,
            user.email_verified
        ])
        return result?.student_id;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveStudentSignup() `, error);
        throw error;
    }
}

export async function udpateSignupType(connection: PoolClient, studentId: number, signupType: string, googleUuid: string) {
    try {
        const query: string = `update student set signupType = $1, google_uuid = $2 where student_id = $3`;
        return await updateRecord(connection, query, [studentId, googleUuid, signupType]);
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateSignupType() `, error);
        throw error;
    }
}
export async function getOTP(connection: PoolClient, userId: number, otpType: string, contactType: string, isStudent: boolean) {
    try {
        const query: string = `SELECT *
        FROM auth_otp
        WHERE
          otp_type = $1
          AND contact_type = $2
          AND user_id = $3
          AND is_student = $4
          AND is_verified = $5
          AND EXTRACT(EPOCH FROM NOW() - created_at) / 60 BETWEEN 0 AND 10`
        return await fetchRecord(connection, query, [
            otpType,
            contactType,
            userId,
            isStudent,
            false
        ]);
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.getOTP() `, error);
        throw error;
    }
}

export async function updateOTP(connection: PoolClient, id: number) {
    try {
        const query: string = `update auth_otp set is_verified = true where id = $1`;
        await updateRecord(connection, query, [
            id
        ]);
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateOTP() `, error);
        throw error;
    }
}

export async function updateOTPTime(connection: PoolClient, id: number) {
    try {
        const query: string = `update auth_otp set created_at = now() where id = $1`;
        await updateRecord(connection, query, [id]);
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateOTPTime() `, error);
        throw error;
    }
}

export async function saveOTP(connection: PoolClient,
    studentId: number,
    otpType: string,
    contactType: string,
    isStudent: boolean) {
    logger.info(`${TAG}.saveOTP()`);
    try {
        const otp = await generateOTP(DEFAULT_OTP_LENGTH);
        const query: string = `insert into auth_otp(user_id, otp, otp_type, contact_type, is_student, created_by)
        values($1, $2, $3, $4, $5, $6)`;
        await saveRecord(connection, query, [
            studentId,
            otp,
            otpType,
            contactType,
            isStudent,
            studentId
        ])
        return otp;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveOTP() `, error);
        throw error;
    }
}

export async function validateOTP(connection: PoolClient, userId: number, contactType: string, otpType: string, isStudent: boolean) {
    try {
        logger.info(`${TAG}.checkOTPExist() `);
        //let query = 'select * from AUTH_OTP where USER_ID=:userId and OTP = :otp and TYPE = :type';
        let query = `SELECT
        *
        FROM
        auth_otp
        WHERE
        user_id =  $1
        AND contact_type = $2
        AND otp_type = $3
        AND is_verified = $4
        AND is_student = $5
        AND EXTRACT(EPOCH FROM (NOW() - created_at)) / 60 BETWEEN 0 AND 10;
    `
        const otpData = await fetchRecord(connection, query, [
            userId,
            contactType,
            otpType,
            false,
            isStudent
        ]);
        return otpData;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkOTPExist()`, error);
        throw error;
    }
}
export async function updateStudentSignup(connection: PoolClient, studentId: number, user: IUser) {
    logger.info(`${TAG}.updateStudent()`);
    try {
        const signupType = SIGNUP_TYPE.formSignup;
        const query: string = `update student set first_name = $1 , last_name = $2, email = $3, phone = $4, password = $5,
        signup_type = $6, terms_and_condition = $7 where student_id = $8`
        await updateRecord(connection, query, [
            user.firstName,
            user.lastName,
            user.email,
            user.phone,
            user.password,
            signupType,
            user.termsAndCondition,
            studentId
        ])
        return;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateStudent() `, error);
        throw error;
    }
}

export async function upadateUserEmailVerifiedStatus(connection: PoolClient, studentId: number) {
    logger.info(`${TAG}.updateUserEmailVerifiedStatus() `);
    try {
        const query: string = `update student set is_email_verified = true where student_id = $1`;
        await updateRecord(connection, query, [
            studentId
        ])
        return;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserEmailVerifiedStatus() `, error);
        throw error;
    }
}

export async function upadateUserPhoneVerifiedStatus(connection: PoolClient, studentId: number) {
    logger.info(`${TAG}.updateUserPhoneVerifiedStatus() `);
    try {
        const query: string = `update student set is_phone_verified = true where student_id = $1`;
        await updateRecord(connection, query, [
            studentId
        ])
        return;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserVerifiedStatus() `, error);
        throw error;
    }
}

export async function updateStudentStatus(connection: PoolClient, studentId: number, status: string) {
    logger.info(`${TAG}.updateStudentStatus() `);
    try {
        const query: string = `update student set status = $1 where student_id = $2`;
        await updateRecord(connection, query, [
            status,
            studentId
        ])
        return;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserVerifiedStatus() `, error);
        throw error;
    }
}

export async function updateStudentPassword(connection: PoolClient, studentId: number, password: string) {
    logger.info(`${TAG}.updateStudentPassword() ==> `, studentId, password);
    try {
        const query: string = `update student set password = $1 where student_id = $2`;
        await updateRecord(connection, query, [
            password,
            studentId
        ])
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.udpateStudentPassword() `, error);
        throw error;
    }
}

export async function checkEmailOrPhoneExist(connection: PoolClient, email: string, phoneNumber?: string) {
    logger.info(`${TAG}.checkEmailOrPhoneExist()  ==>`, email, phoneNumber);
    try {
        const query: string = 'select * from user_tbl where email= $1 or phone = $2';
        const user = await fetchRecord(connection, query, [email, phoneNumber]);
        //  logger.debug("user::"+nodeUtil.inspect(user))
        return user;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkEmailOrPhoneExist()`, error);
        throw error;
    }
}

export async function saveUser(connection: PoolClient, user: any, createdBy) {
    logger.info(`${TAG}.saveUser()`);
    try {
        const uid = crypto.randomUUID();
        user.status = STATUS.unVerified;
        const sqlQuery: string = `insert into users(uid, first_name, last_name, email, 
            phone, password, status, first_time_login, terms_and_condition, created_by)
        values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning user_id`;
        const result = await saveRecord(connection, sqlQuery, [
            uid,
            user.firstName ?? null,
            user.lastName ?? null,
            user.email,
            user.phone,
            user.password,
            user.status,
            true,
            true,
            createdBy || 1
        ]);
        return result?.user_id;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveUser() `, error);
        throw error;
    }
}

export async function saveCollegeDetails(connection: PoolClient, user: any, userSession: IUserSession) {
    logger.info(`${TAG}.saveCollegeDetails()`);
    try {
        const uid = crypto.randomUUID();
        const query: string = `insert into user_college_details (uid, user_id, college_name, college_id, created_by )
        values($1, $2, $3, $4, $5);`;
        await saveRecord(connection, query, [
            uid,
            user.userId,
            user.collegeName,
            user.collegeId,
            userSession.userId
        ])
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveCollegeProfileDetails() `, error);
        throw error;
    }
}
export async function assignRole(connection: PoolClient, userId: number, role: string) {
    logger.info(`${TAG}.assignRole()`);
    try {
        logger.info(`${TAG}.assignRoles() ==> `, userId, role)
        const query: string = 'insert into user_roles(role_id, user_id) values((select id from roles where role_name = $1), $2);'
        await saveRecord(connection, query, [
            role,
            userId
        ])
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.assignRole() `, error);
        throw error;
    }
}

export async function updateUserPassword(connection: PoolClient, userId: number, password: string) {
    logger.info(`${TAG}.updateUserPassword()`);
    try {
        const query: string = 'update users set password= $1 where user_id = $2';
        await updateRecord(connection, query, [
            password,
            userId
        ])
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserPassword() `, error);
        throw error;
    }
}

export async function updateUserLoginStatus(connection: PoolClient, userId) {
    logger.info(`${TAG}.updateUserLoginStatus()`);
    try {
        const query: string = 'update users set first_time_login = false where user_id = $1'
        await updateRecord(connection, query, [
            userId
        ])
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.updateUserLoginStatus() `, error);
        throw error;
    }
}
export async function saveUsers(connection, user: IUser): Promise<string> {
    logger.info(`${TAG}.saveUsers()`);
    try {
        const sqlQuery: string = `insert into user_tbl(firstname, lastname, email, phone, passwd, status_id,
           last_modified_by, created_by)
           values($1, $2, $3, $4, $5, $6, $7, $8) returning user_id`;

        const result = await saveRecord(connection, sqlQuery, [
            user.firstName,
            user?.lastName ?? null,
            user.email,
            user.phone,
            user.password,
            2,
            user?.lastUpdatedBy?.id ?? null,
            user?.createdBy?.id ?? null,
        ]);
        console.log(result);
        return result?.rows[0].id;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveUsers()`, error);
        throw error;
    }
}

export async function fetchUserDetails(connection: PoolClient, userId: string): Promise<IUser> {
    logger.info(`${TAG}.fetchUserDetails()`);
    try {
        const sqlQuery = `select * from user_tbl where user_id = $1`;
        const dbResult = await fetchRecord(connection, sqlQuery, [userId]);
        logger.debug(nodeUtil.inspect(dbResult, { depth: 4 }))
        return getUserFromUserTbl(dbResult);
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.fetchUserDetails()`, error);
        throw error;
    }
}

export async function checkUserExist(connection: PoolClient, userId: string): Promise<boolean> {
    logger.info('CHECKING user exists!');
    try {
        const sqlQuery: string = `SELECT AU.USER_ID,
        AU.UID,
        AU.FIRST_NAME,
        AU.LAST_NAME,
        AU.EMAIL,
        AU.PHONE,
        AU.PASSWORD,
        AU.STATUS,
        AU.FIRST_TIME_LOGIN,
        R.ROLE_NAME
    FROM USERS AU
    JOIN USER_ROLES UR ON AU.USER_ID = UR.USER_ID
    JOIN ROLES R ON R.ID = UR.ROLE_ID
    WHERE EMAIL = $1;`;

        const result = await fetchRecord(connection, sqlQuery, [userId]);
        return result;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkUserExist()`, error);
        throw error;
    }
}

export async function checkUserEmailOrPhoneExist(connection: PoolClient, email?: string, phoneNumber?: string) {
    logger.info(`${TAG}.checkEmailOrPhoneExist()  ==>`, email, phoneNumber);
    try {
        const query: string = 'select * from users where email= $1 or phone = $2';
        const user = await fetchRecord(connection, query, [email, phoneNumber]);
        //  logger.debug("user::"+nodeUtil.inspect(user))
        return user;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkEmailOrPhoneExist()`, error);
        throw error;
    }
}

export async function checkUserRoleExist(connection: PoolClient, userId: string): Promise<boolean> {
    logger.info('CHECKING user role exists exists!');
    try {
        const sqlQuery: string = 'select user_id from tbl_user_role where user_id= $1';

        const result = await fetchRecord(connection, sqlQuery, [userId]);
        return !!result;
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.checkUserRoleExist()`, error);
        throw error;
    }
}

