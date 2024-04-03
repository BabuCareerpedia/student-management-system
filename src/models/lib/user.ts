import { AuditInfo, IAuditInfo } from './audit_info'
import { IBaseRecord } from './base_record'

export type IUser = IAuditInfo & {
    id?: string
    uid?: string
    firstName: string
    lastName: string
    email: string
    phone: string
    password?: string
    termsAndCondition?: boolean
    status?: string
    isEmailVerified?: boolean
    isPhoneVerified?: boolean
    firstTimeLogin?: boolean
    accessToken?: string
    refreshToken?: string
    role?: string
    lastLoggedDate?: string
}

export class User extends AuditInfo implements IUser {
    public id?: string
    public uid?: string
    public firstName: string
    public lastName: string
    public email: string
    public phone: string
    public password?: string
    public termsAndCondition?: boolean
    public status?: string
    public isEmailVerified?: boolean
    public isPhoneVerified?: boolean
    public firstTimeLogin?: boolean
    public accessToken?: string
    public refreshToken?: string
    public role?: string
    public lastLoggedDate?: string

    constructor(firstName: string,
        lastName: string,
        email: string,
        phone: string,
        password?: string,
        termsAndCondition?: boolean,
        status?: string,
        isEmailVerified?: boolean,
        isPhoneVerified?: boolean,
        firstTimeLogin?: boolean,
        accessToken?: string,
        refreshToken?: string,
        role?: string,
        createdBy?: IBaseRecord,
        creationTime?: Date,
        lastUpdatedBy?: IBaseRecord,
        lastUpdatedTime?: Date) {
        super(createdBy, creationTime, lastUpdatedBy, lastUpdatedTime);
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.phone = phone
        this.password = password
        this.termsAndCondition = termsAndCondition
        this.status = status
        this.isEmailVerified = isEmailVerified
        this.isPhoneVerified = isPhoneVerified
        this.firstTimeLogin = firstTimeLogin
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.role = role
    }
}
