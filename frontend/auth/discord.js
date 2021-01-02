const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const request = require("request");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(discordId, done) => {
    try {
        let user = await new Promise((resolve, reject) => {
            request(
                `http://localhost:3009/api/v1/users/${discordId}`, {
                    json: true,
                },
                (error, res, body) => {
                    if (!error && res.statusCode === 200) {
                        resolve(body);
                    } else {
                        reject(error);
                    }
                }
            );
        });
        if (user.status === 200) {
            return done(null, user.data);
        } else {
            return done(null, null);
        }
    } catch (error) {
        console.log(error);
        return done(error, null);
    }
});

passport.use(
    new DiscordStrategy({
            clientID: require("./discord_variables").clientID,
            clientSecret: require("./discord_variables").secret,
            callbackURL: "http://localhost:3007/auth/discord/redirect",
            scope: ["identify", "email", "guilds"],
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                request(
                    `http://localhost:3009/api/v1/users/${profile.id}`, {
                        json: true,
                    },
                    (error, res, body) => {
                        if (!error) {
                            if (body.status === 200) {
                                if (!body.data.verified && profile.guilds.findIndex((guild) => guild.id === "776547645006938112") >= 0) {
                                    request.patch(
                                        `http://localhost:3009/api/v1/users/${profile.id}`, {
                                            json: {
                                                verified: 1,
                                            },
                                        },
                                        (error, res, body) => {
                                            if (!error && res.statusCode === 200) {
                                                return done(null, body.data);
                                            } else {
                                                console.log(error);
                                                return done(error, null);
                                            }
                                        }
                                    );
                                } else done(null, body.data);
                            } else {
                                request.post(
                                    `http://localhost:3009/api/v1/users/`, {
                                        json: {
                                            token: accessToken,
                                            discordId: profile.id,
                                            email: profile.email,
                                            username: profile.username,
                                            tag: profile.discriminator,
                                        },
                                    },
                                    (error, res, body) => {
                                        if (!error && res.statusCode === 200) {
                                            return done(null, body.data);
                                        } else {
                                            console.log(error);
                                            return done(error, null);
                                        }
                                    }
                                );
                            }
                        } else {
                            console.log(error);
                            return done(error, null);
                        }
                    }
                );
            } catch (error) {
                console.log(error);
                return done(error, null);
            }
        }
    )
);