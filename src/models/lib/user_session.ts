export type IUserSession = {
    userId: number
    userUid: string
    email: string
    phone: string
    role: string
    userName: string
    otpType?: string
    isEmailVerified?: boolean
    isPhoneVerified?: boolean
    permissions: string[]
}

export class UserSession implements IUserSession {
    public userId: number
    public userUid: string
    public email: string
    public phone: string
    public role: string
    public userName: string
    public otpType?: string
    public isEmailVerified?: boolean
    public isPhoneVerified?: boolean
    public permissions: string[]

    constructor(
        userId: number,
        userUid: string,
        email: string,
        phone: string,
        role?: string,
        userName?: string,
        otpType?: string,
        isEmailVerified?: boolean,
        isPhoneVerified?: boolean,
        permissions?: string[]
    ) {
        this.userId = userId
        this.userUid = userUid
        this.email = email
        this.phone = phone
        this.role = role
        this.userName = userName
        this.otpType = otpType
        this.isEmailVerified = isEmailVerified
        this.isPhoneVerified = isPhoneVerified
        this.permissions = permissions
    }
}
