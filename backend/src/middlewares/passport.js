const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const path = require('path');
const UserProfile = require('../models/user-profile.model');
require('dotenv').config({ path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`) });

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const t = await User.sequelize.transaction();
      try {
        const hasUser = await User.findOne({ where: { googleId: profile.id } });
        let userProfile;
        if (!hasUser) {
          userProfile = await UserProfile.create();
        } else {
          userProfile = await UserProfile.findByPk(hasUser.user_profile_id);
        }
        const [user] = await User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            password: profile.id + Math.random() * 1000,
            name: profile.displayName,
            email: profile.emails[0].value,
            permission_id: 3,
            user_profile_id: userProfile.id,
          },
        });
        await t.commit();
        return done(null, user);
      } catch (err) {
        await t.rollback();
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
