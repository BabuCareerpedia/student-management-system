// import logger from '@logger';
// import {Address, City, Country, IAddress, IUserSession, State} from '@models';

// export function addressDataMapping(payload: any, id?: string, loggedInUser?: IUserSession): IAddress {
//     logger.info('helpers.data_mapping.address.addressDataMapping()');
//     try {
//         if (!payload) {
//             payload = {};
//         }
//         return new Address(
//             payload?.addressLine1,
//             new City(payload?.city?.id),
//             new State(payload?.state?.id),
//             new Country(payload?.country?.id),
//             payload?.postalCode,
//             payload?.addressLine2,
//             id,
//             loggedInUser,
//         );
//     } catch (error) {
//         logger.error('ERROR occurred in helpers.data_mapping.address.addressDataMapping()');
//     }
// }
