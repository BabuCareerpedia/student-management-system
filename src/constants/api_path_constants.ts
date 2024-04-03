import { PathParams } from '@constants/api_param_constants';

export const ROOT = '/';
export const ROUTER_AUTH = '/auth';
export const ROUTER_USER = '/users';
export const ROUTER_PROFILE = '/profile';

// paths related to Authentication
export const GET_REFRESH_TOKEN = `/refreshToken`;
export const STUDENT_SIGNUP = `/student/register`;
export const STUDENT_LOGIN = `/student/login`;
export const STUDENT_CHANGE_PASSWORD = `/student/change-password`;
export const STUDENT_FORGOT_PASSWORD = `/student/forgot-password`;
export const STUDENT_UPDATE_PASSWORD = `/student/update-password`;
export const STUDENT_RESEND_OTP = `/student/otp/resend`;
export const ADD_STUDENT_PHONE_NUMBER = `/student/phone`;

export const ADMIN_REGISTER_MENTOR = `/admin/register/mentor`;
export const ADMIN_REGISTER_COLLEGE = `/admin/register/college`;
export const ADMIN_REGISTER_RECRUITER = `/admin/register/recruiter`;
export const ADMIN_SIGNUP = `/admin/signup`;
export const USER_LOGIN = `/user/login`;
export const USER_CHANGE_PASSWORD = `/user/change-password`;
export const USER_FORGOT_PASSWORD = `/user/forgot-password`;
export const USER_UPDATE_PASSWORD = `/user/update-password`;
export const USER_OTP_RESEND = `/user/otp/resend`;


export const VERIFY_OTP = `/otp/verify`;

//paths related to google authentication
export const STUDENT_GOOGLE_LOGIN = `/student/google/login`;
export const STUDENT_GOOGLE_CALLBACK = `/student/google/callback`;
export const STUDENT_GOOGLE_REDIRECT = `/student/google/redirect`;

// paths related to master data

export const PATH_COUNTRIES = `/countries`;
export const PATH_STATES = `/states`;
export const PATH_CITIES = `/cities`;
export const PATH_PERSON_TITLES = `/personTitles`;
export const PATH_USER_STATUS = '/userStatus';
export const PATH_ROLES = '/roles';

// paths related to users

export const SUB_PATH_USER_INSTANCE = `/:${PathParams.USER_ID}`;
export const SUB_PATH_USER_EMAIL = `/emails`;
export const SUB_PATH_USER_ACTION = `${SUB_PATH_USER_INSTANCE}/actions/:${PathParams.ACTION}`;
export const SUB_PATH_USER_ROLE = `${SUB_PATH_USER_INSTANCE}/roles/:${PathParams.ROLE_ID}`;


// paths related to HRms

export const SUB_PATH_HRMS_EMPLOYEES = `/employees`;


// paths related to profile


export const MENTOR = '/mentor';


