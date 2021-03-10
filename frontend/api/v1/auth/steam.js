const passport = require("passport");
const apiVariables = require("../api_variables");
const users = require("../database/users");
const SteamStrategy = require("passport-steam");

passport.use(
  new SteamStrategy(
    {
      returnURL: `${process.env.HOST}${
        process.env.ENABLE_PORT === "true" ? ":" + process.env.PORT : ""
      }/api/v1/auth/steam/redirect`,
      realm: `${process.env.HOST}${
        process.env.ENABLE_PORT === "true" ? ":" + process.env.PORT : ""
      }`,
      apiKey: apiVariables.steamAPI,
      passReqToCallback: true,
    },
    function (req, identifier, profile, done) {
      console.log(profile);
      console.log(identifier);
      if (!req.user) return done(null, null);
      users.editUser(
        req.user._id,
        {
          [`settings.steam`]: profile.id,
        },
        done
      );
    }
  )
);
