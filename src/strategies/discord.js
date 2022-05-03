const passport = require("passport");
const DiscordStrategies = require("passport-discord");
const user = require("../database/schemas/user");
const OAuth2Credentials = require("../database/schemas/Oauth2Credentials");
const { encrypt } = require("../utils/utils");
const jwt = require('jsonwebtoken')

passport.serializeUser((user, done) => {
    done(null, user.discordId);
});
passport.deserializeUser(async(discordId, done) => {
    try {
        const User = await user.findOne({
            discordId,
        });
        return User ? done(null, User) : done(null, null);
    } catch (err) {
        done(err, null);
        console.log(err);
    }
});
passport.use(
    new DiscordStrategies({
            clientID: process.env.DASHBOARD_CLIENT_ID,
            clientSecret: process.env.DASHBOARD_SECRET_ID,
            callbackURL: process.env.DASHBOARD_CALLBACK_URL,
            scope: ["guilds", "identify"],
        },
        async(accessToken, refreshToken, profile, done) => {
            const encryptedToken = accessToken//encrypt(accessToken).toString();
            const encryptedRefreshToken = refreshToken //encrypt(refreshToken).toString();
            try {
                const { id, username, discriminator, avatar } = profile;
                const findUser = await user.findOneAndUpdate({ discordId: id }, {
                    discordTag: `${username}#${discriminator}`,
                    avatar,
                }, { new: true });
                const encryptedJWTToken = jwt.sign(encryptedToken, "1234")
                const encryptedJWTRefreshToken = jwt.sign(encryptedRefreshToken, "1234")
                //localStorage.setItem("token", encryptedJWTToken) for the frontend

                if (findUser) {
                    return done(null, findUser, {token: encryptedJWTToken, refreshToken: encryptedJWTRefreshToken});
                } else {
                    const newUser = await user.create({
                        discordId: id,
                        discordTag: `${username}#${discriminator}`,
                        avatar,
                    });
                    return done(null, newUser, {token: encryptedJWTToken, refreshToken: encryptedJWTRefreshToken});
                }
            } catch (err) {
                console.log(err);
                return done(err, null);
            }
        }
    )
);