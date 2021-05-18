const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
require("dotenv").config();

passport.use(
  "auth",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SERVER_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub).select("-password");
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

const auth = passport.authenticate("auth", {
  session: false,
});

module.exports = { auth };
