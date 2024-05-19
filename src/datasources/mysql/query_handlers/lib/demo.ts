import {fetchRecord, updateRecord,saveRecord} from '../../helpers/query_execution';
import logger from '@logger';
import {BaseRecord} from '@models';
import {PoolClient} from 'pg';


const TAG = "DEMO_USER"

export async function saveUserDetails(user:any,connection) {
    console.log(user)
    logger.info(`${TAG}.saveUserDetails()`);
    try {
        const personalDetailsQuery: string = `INSERT INTO data (name, email, password) VALUES ($1,$2,$3);`
        const personalDetails = await saveRecord(connection, personalDetailsQuery,[user.name,user.email,user.password])
        console.log(personalDetails)
        return personalDetails
    } catch (error) {
        logger.error(`ERROR occurred in ${TAG}.saveUserDetails() `, error);
        throw error;
    }
}