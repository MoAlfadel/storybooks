const express = require("express");
const app = express();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/redirect",
            // callbackURL: "domainname/google/redirect",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                //find the user in our database
                const foundUser = await User.findOne({
                    "google.profileId ": profile.id,
                });
                if (foundUser) {
                    //If user present in our database.
                    done(null, foundUser);
                } else {
                    // if user is not preset in our database save user data to database.
                    //get the user data from google
                    const newUserInfo = {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                        createdAt: Date.now(),
                    };
                    const user = new User({
                        google: { profileId: profile.id },
                        ...newUserInfo,
                    });
                    await user.save();
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
            }
        } // end googleStrategy callback
    )
);
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
    let user = await User.findById(id);
    if (user) {
        done(null, user);
    }
});
