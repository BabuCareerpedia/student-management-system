export type IJwtPayload = {
  userId: number
  userUID: string
  email: string
  firstName: string
  lastName: string
  phone: string
  otpType?: string
  role: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  firstTimeLogin?: boolean
  permissions: string[]
}

export class JwtPayload implements IJwtPayload {
  public userId: number
  public userUID: string
  public email: string
  public phone: string
  public firstName: string
  public lastName: string
  public otpType?: string
  public role: string
  public isEmailVerified?: boolean
  public isPhoneVerified?: boolean
  public firstTimeLogin?: boolean
  public permissions: string[]

  constructor(
    userId: number,
    userUID: string,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    otpType?: string,
    role?: string,
    isEmailVerified?: boolean,
    isPhoneVerified?: boolean,
    firstTimeLogin?: boolean,
    permissions?: string[]
  ) {
    this.userId = userId
    this.userUID = userUID
    this.email = email
    this.phone = phone
    this.firstName = firstName
    this.lastName = lastName
    this.otpType = otpType
    this.role = role
    this.isEmailVerified = isEmailVerified
    this.isPhoneVerified = isPhoneVerified
    this.firstTimeLogin = firstTimeLogin
    this.permissions = permissions
  }
}
