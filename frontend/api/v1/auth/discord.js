const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const apiVariables = require("../api_variables");
const db = require("../db");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(discordId, done) => {
    db.getUserById(discordId, done);
});

passport.use(
    new DiscordStrategy({
            clientID: apiVariables.clientID,
            clientSecret: apiVariables.secret,
            callbackURL: "http://localhost:3007/api/v1/auth/discord/redirect",
            scope: ["identify", "email", "guilds"],
        },
        async(accessToken, refreshToken, profile, done) => {
            db.getUserById(profile.id, (error, user) => {
                if (user && !user.verified && profile.guilds.findIndex((guild) => guild.id === apiVariables.discordServerId) >= 0) {
                    return db.updateUserById(
                        profile.id, {
                            verified: 1,
                        },
                        done
                    );
                } else if (user) {
                    return done(null, user);
                } else {
                    return db.createUser({
                            discordId: profile.id,
                            token: accessToken,
                            email: profile.email,
                            username: profile.username,
                            tag: profile.discriminator,
                        },
                        (error, user) => {
                            if (user && !user.verified && profile.guilds.findIndex((guild) => guild.id === apiVariables.discordServerId) >= 0)
                                return db.updateUserById(
                                    profile.id, {
                                        verified: 1,
                                    },
                                    done
                                );
                            else return done(error, user);
                        }
                    );
                }
            });
        }
    )
);