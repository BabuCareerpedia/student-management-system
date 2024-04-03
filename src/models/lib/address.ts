import {BaseRecord} from './base_record';
import {IUserSession} from './user_session';
import {AuditInfo} from './audit_info';
import {BaseRecordAudit, IBaseRecordAudit} from './base_record_audit';
import {ICity} from './city';
import {ICountry} from './country';
import {IState} from './state';

export type IAddress = {
    addressLine1: string;
    addressLine2?: string;
    city: ICity;
    state: IState;
    country: ICountry;
    postalCode: string;
} & IBaseRecordAudit

export class Address extends BaseRecordAudit implements IAddress {
    public addressLine1: string;
    public addressLine2?: string;
    public city: ICity;
    public state: IState;
    public country: ICountry;
    public postalCode: string;

    constructor(addressLine1: string, city: ICity, state: IState, country: ICountry, postalCode: string,
                addressLine2?: string, id?: string, loggedInUser?: IUserSession) {
        if (loggedInUser) {
            super(id, null,
                new AuditInfo(
                    new BaseRecord(`${loggedInUser.userId}`),
                    new Date(),
                    new BaseRecord(`${loggedInUser.userId}`),
                    new Date()));
        } else {
            super(id);
        }
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postalCode = postalCode;
    }
}
