import jsonwebtoken from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET, OTP_EXPIRY_TIME } from '@config';
import { JWT_ACCESS_TOKEN_EXPIRY_TIME, JWT_REFRESH_TOKEN_EXPIRY_TIME } from '@config';
import logger from '@logger';
import { JwtPayload } from '@models'

function generateJWT(payload: JwtPayload, expiresIn: number, secret: string): string {
    return jsonwebtoken.sign(Object.assign({}, payload), secret, {
        algorithm: 'HS256',
        expiresIn,
    });
}

export function generateAccessToken(payload: JwtPayload, expiresIn: number = JWT_ACCESS_TOKEN_EXPIRY_TIME)
    : string {
    try {
        return generateJWT(payload, expiresIn, JWT_ACCESS_TOKEN_SECRET);
    } catch (e) {
        logger.error(`ERROR in login generateAccessToken() => ${e}`);
    }
}

export function generateRefreshToken(payload: JwtPayload, expiresIn: number = JWT_REFRESH_TOKEN_EXPIRY_TIME)
    : string {
    try {
        return generateJWT(payload, expiresIn, JWT_REFRESH_TOKEN_SECRET);
    } catch (e) {
        logger.error(`ERROR in login generateRefreshToken() => ${e}`);
    }
}

export function verifyAccessToken(token: string): any {
    return jsonwebtoken.verify(token, JWT_ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string): any {
    return jsonwebtoken.verify(token, JWT_REFRESH_TOKEN_SECRET);
}

export async function generateOTPToken(payload: JwtPayload, expiresIn = OTP_EXPIRY_TIME) {
    try {
        return generateJWT(payload, expiresIn, JWT_ACCESS_TOKEN_SECRET);
    } catch (error) {
        logger.error(`ERROR in login generateRefreshToken() => ${error}`);
    }
}

export const verifyOTPToken = async (token: string) => {
    return jsonwebtoken.verify(token, JWT_ACCESS_TOKEN_SECRET);
};