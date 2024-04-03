import { GOOGLE_OAUTH } from "@config";
import { MailScopes } from "@constants/oauth_constants";
import logger from "@logger";
const GoogleStrategy = require("passport-google-oauth20").Strategy

export function passportConfiguration(passport): any {
    logger.info('passportConfiguration()')
    try {

        passport.use(
            new GoogleStrategy(
                {
                    clientID: GOOGLE_OAUTH.clientId,
                    clientSecret: GOOGLE_OAUTH.clientSecret,
                    callbackURL: GOOGLE_OAUTH.clientRedirectUrl,
                    scope: MailScopes,
                },
                (accessToken, refreshToken, profile, callback) => {
                    callback(null, profile);
                }
            )
        );
        passport.serializeUser(function (user, done) {
            done(null, user)
        })

        passport.deserializeUser(function (user, done) {
            done(null, user)
        })

    } catch (e) {
        logger.error('Error in passportConfiguration()', e)
    }
}


