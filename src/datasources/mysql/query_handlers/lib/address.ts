// import {addressDataMapping} from '../../data_mappers/address';
// import {fetchRecord, saveRecord, updateRecord} from '../../helpers/query_execution';
// import logger from '@logger';
// // import {IAddress} from '@models';
// import {PoolClient} from 'pg';

// export async function saveAddress(connection, payload: IAddress): Promise<string> {
//     logger.info('data_stores.mysql.lib.address.saveAddress()');
//     try {
//         logger.debug('STARTED saving address.');
//         const sqlQuery = 'insert into tbl_address(address_line_1, address_line_2, city_id, state_id,country_id,'
//             + ' postal_code,created_by,created_at,last_updated_by,last_updated_at) '
//             + ' values(:address_line_1, :address_line_2, :city_id, :state_id,:country_id,:postal_code,:created_by,'
//             + ' :created_at,:last_updated_by,:last_updated_at)';

//         return await saveRecord(connection, sqlQuery, {
//             address_line_1: payload?.addressLine1 ?? null,
//             address_line_2: payload?.addressLine2 ?? null,
//             city_id: payload?.city?.id ?? null,
//             state_id: payload?.state?.id ?? null,
//             country_id: payload?.country?.id ?? null,
//             postal_code: +payload?.postalCode ?? null,
//             created_at: payload?.auditInfo?.creationTime ?? new Date(),
//             created_by: payload?.auditInfo?.createdBy?.id ?? null,
//             last_updated_at: payload?.auditInfo?.lastUpdatedTime ?? new Date(),
//             last_updated_by: payload?.auditInfo?.lastUpdatedBy?.id ?? null,
//         });

//     } catch (error) {
//         logger.error('ERROR occurred in data_stores.mysql.lib.address.saveAddress()', error);
//         throw error;
//     }
// }

// export async function updateAddress(connection: PoolClient, addressId: string, payload: IAddress): Promise<void> {
//     logger.info('data_stores.mysql.lib.address.updateAddress()');
//     try {
//         logger.debug('STARTED updating address.');
//         const sqlQuery = `update tbl_address set address_line_1=:address_line_1,address_line_2=:address_line_2,`
//             + ' city_id=:city_id, state_id=:state_id,country_id=:country_id,postal_code=:postal_code,'
//             + ' last_updated_at=:last_updated_at,last_updated_by=:last_updated_by'
//             + ' where address_id=:address_id';

//         return updateRecord(connection, sqlQuery, {
//             address_id: addressId,
//             address_line_1: payload?.addressLine1 ?? null,
//             address_line_2: payload?.addressLine2 ?? null,
//             city_id: payload?.city?.id ?? null,
//             state_id: payload?.state?.id ?? null,
//             country_id: payload?.country?.id ?? null,
//             postal_code: +payload?.postalCode ?? null,
//             last_updated_at: payload?.auditInfo?.lastUpdatedTime ?? new Date(),
//             last_updated_by: payload?.auditInfo?.lastUpdatedBy?.id ?? null,
//         });

//     } catch (error) {
//         logger.error('ERROR occurred in data_stores.mysql.lib.address.updateAddress()', error);
//         throw error;
//     }
// }

// export async function getCompanyAddress(connection: PoolClient, companyId: string): Promise<IAddress> {
//     logger.info('data_stores.mysql.lib.address.getCompanyAddress()');
//     try {
//         logger.debug('STARTED fetching company address.');
//         const sqlQuery = 'select ta.address_id, ta.address_line_1, ta.address_line_2, ta.city_id, ta.state_id,ta.country_id'
//             + ' ,ta.postal_code,tmc.city_name,tmc.city_code, tms.state_name, tms.state_code'
//             + ' ,tmcr.country_name, tmcr.country_code_3d as country_code'
//             + ' from tbl_company_addresses tca join tbl_address ta on ta.address_id = tca.address_id'
//             + ' left join tbl_m_city tmc on tmc.city_id = ta.city_id'
//             + ' left join tbl_m_state tms on tms.state_id = ta.state_id'
//             + ' left join tbl_m_country tmcr on tmcr.country_id = ta.country_id'
//             + ' where tca.company_id =:company_id';

//         const result = await fetchRecord(connection, sqlQuery, {
//             company_id: companyId,
//         });
//         return addressDataMapping(result);
//     } catch (error) {
//         logger.error('ERROR occurred in data_stores.mysql.lib.address.getCompanyAddress()', error);
//         throw error;
//     }
// }

// export async function getPocAddress(connection: PoolClient, clientPocId: string): Promise<IAddress> {
//     logger.info('data_stores.mysql.lib.address.getPocAddress()');
//     try {
//         logger.debug('STARTED fetching company address.');
//         const sqlQuery = 'select ta.address_id, ta.address_line_1, ta.address_line_2, ta.city_id, ta.state_id,ta.country_id'
//             + ' ,ta.postal_code,tmc.city_name,tmc.city_code, tms.state_name, tms.state_code'
//             + ' ,tmcr.country_name, tmcr.country_code_3d as country_code'
//             + ' from tbl_poc tca join tbl_address ta on ta.address_id = tca.address_id'
//             + ' left join tbl_m_city tmc on tmc.city_id = tmc.city_id'
//             + ' left join tbl_m_state tms on tmc.state_id = tmc.state_id'
//             + ' left join tbl_m_country tmcr on tmcr.country_id = tmc.country_id'
//             + ' where tca.poc_id =:poc_id';

//         const result = await fetchRecord(connection, sqlQuery, {
//             poc_id: clientPocId,
//         });
//         return addressDataMapping(result);
//     } catch (error) {
//         logger.error('ERROR occurred in data_stores.mysql.lib.address.getPocAddress()', error);
//         throw error;
//     }
// }

// export async function saveCompanyAddress(connection, companyId: string, addressId: string,
//                                          referenceOnly: boolean = false): Promise<any> {
//     logger.info('data_stores.mysql.lib.address.saveCompanyAddress()');

//     try {
//         logger.debug('STARTED saving company address.');
//         const sqlQuery = 'insert into tbl_company_addresses(company_id, address_id, reference_only)'
//             + ' values(:company_id, :address_id, :reference_only)';

//         return saveRecord(connection, sqlQuery, {
//             company_id: companyId,
//             address_id: addressId,
//             reference_only: referenceOnly,
//         });
//     } catch (error) {
//         logger.error('ERROR occurred in data_stores.mysql.lib.address.saveCompanyAddress()', error);
//         throw error;
//     }
// }

// export async function fetchClientAddressId(connection: PoolClient, clientId: string): Promise<any> {
//     logger.info('data_stores.mysql.lib.address.fetchClientCompanyAddressId()');

//     try {
//         logger.debug('STARTED fetching client company address.');
//         const sqlQuery = 'SELECT address_id FROM tbl_company c join tbl_company_addresses ca on '
//             + ' c.company_id=ca.company_id where c.client_id=:client_id';

//         const result: any = await fetchRecord(connection, sqlQuery, {
//             client_id: clientId
//         });
//         return result?.address_id;
//     } catch (error) {
//         logger.error('ERROR occurred in data_stores.mysql.lib.address.fetchClientCompanyAddressId()', error);
//         throw error;
//     }
// }

// export async function fetchCompanyAddressId(connection: PoolClient, companyId: string): Promise<any> {
//     logger.info('data_stores.mysql.lib.address.fetchCompanyAddressId()');

//     try {
//         logger.debug('STARTED fetching client company address.');
//         const sqlQuery = 'SELECT address_id FROM tbl_company c join tbl_company_addresses ca on '
//             + ' c.company_id=ca.company_id where c.company_id=:company_id';

//         const result: any = await fetchRecord(connection, sqlQuery, {
//             company_id: companyId
//         });
//         return result?.address_id;
//     } catch (error) {
//         logger.error('ERROR occurred in data_stores.mysql.lib.address.fetchCompanyAddressId()', error);
//         throw error;
//     }
// }

// export async function fetchAddressDetails(connection: PoolClient, addressId: string): Promise<any> {
//     logger.info('data_stores.mysql.lib.address.fetchAddressDetails()');

//     try {
//         logger.debug('STARTED fetching address.');
//         const sqlQuery = 'select ta.address_id, ta.address_line_1, ta.address_line_2, ta.city_id, ta.state_id,'
//             + ' ta.country_id,ta.postal_code,tmc.city_name,tmc.city_code, tms.state_name, tms.state_code,'
//             + ' tmcr.country_name, tmcr.country_code_3d as country_code'
//             + ' from tbl_address ta '
//             + ' left join tbl_m_city tmc on tmc.city_id = ta.city_id'
//             + ' left join tbl_m_state tms on tms.state_id = ta.state_id'
//             + ' left join tbl_m_country tmcr on tmcr.country_id = ta.country_id'
//             + ' where ta.address_id =:address_id';

//         const result = await fetchRecord(connection, sqlQuery, {
//             address_id: addressId,
//         });
//         return addressDataMapping(result);
//     } catch (error) {
//         logger.error('ERROR occurred in data_stores.mysql.lib.address.fetchAddressDetails()', error);
//         throw error;
//     }
// }
