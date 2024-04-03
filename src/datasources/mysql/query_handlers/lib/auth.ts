import {fetchRecord, updateRecord} from '../../helpers/query_execution';
import logger from '@logger';
import {BaseRecord} from '@models';
import {PoolClient} from 'pg';

export async function fetchUserByEmail(connection: PoolClient, emailId?: string): Promise<any> {
    try {
        logger.info('STARTED checking user Exist in DB with emailId');
        logger.info(`User email Id:${emailId}`);
        const sqlQuery: string = `select * from user_tbl where email = $1`;// and status_id = $2 `;
        return fetchRecord(connection, sqlQuery, [emailId]);
    } catch (e) {
        logger.error('ERROR occurred in dataStores.mysql.auth.fetchUserByEmail()', e);
        throw e;
    }
}

export async function updateLoginActivity(connection: PoolClient, userId: string): Promise<any> {
    try {
        logger.info('STARTED updating login activity in  DB');
        const sqlQuery = `update tbl_user set last_loggedin_at = :last_loggedin_at where user_id = :user_id `;
        return updateRecord(connection, sqlQuery, {
            last_loggedin_at: new Date(),
            user_id: userId

        });
    } catch (e) {
        logger.error('ERROR occurred in dataStores.mysql.auth.updateLoginActivity()', e);
        throw e;
    }
}

export async function getUserRole(connection: PoolClient, userId: string) {
    try {
        logger.info('STARTED fetching user role in  DB');
        const sqlQuery = 'select role_name,tur.role_id,description from tbl_user_role  tur join tbl_m_role tmr '
            + 'on tmr.role_id =tur.role_id where tur.user_id=:user_id';
        const result: any = await fetchRecord(connection, sqlQuery, {
            user_id: userId
        });
        return new BaseRecord(result?.role_id, result?.role_name);
    } catch (e) {
        logger.error('ERROR occurred in dataStores.mysql.auth.getUserRole()', e);
        throw e;
    }
}
