const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const apiVariables = require("../api_variables");
const users = require("../database/users");

passport.serializeUser((user, done) => {
    done(null, user.discordId);
});

passport.deserializeUser((discordId, done) => {
    users.findUser({ discordId: discordId }, done);
});

passport.use(
    new DiscordStrategy({
            clientID: apiVariables.clientID,
            clientSecret: apiVariables.secret,
            callbackURL: `${process.env.HOST}${process.env.ENABLE_PORT === "true" ? ":" + process.env.PORT : ""}/api/v1/auth/discord/redirect`,
            scope: ["identify", "email", "guilds"],
        },
        async(accessToken, refreshToken, profile, done) => {
            users.findUser({ discordId: profile.id }, (err, user) => {
                if (err) done(err, null);
                else if (user) {
                    if (!user.verified && profile.guilds.findIndex((guild) => guild.id === apiVariables.discordServerId) >= 0)
                        users.editUser(
                            user._id, {
                                verified: true,
                            },
                            done
                        );
                    else done(null, user);
                } else {
                    users.addUser({
                            discordId: profile.id,
                            email: profile.email,
                            description: "",
                            username: profile.username,
                            tag: profile.discriminator,
                            avatar: profile.avatar,
                            seen: [],
                            settings: {
                                publicTag: false,
                                language: "en",
                            },
                            verified: profile.guilds.findIndex((guild) => guild.id === apiVariables.discordServerId) >= 0,
                            roles: ["user"],
                        },
                        done
                    );
                }
            });
        }
    )
);