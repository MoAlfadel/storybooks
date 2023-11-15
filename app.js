const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ExpressError = require("./utils/ExpressError");

const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const usersRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const storiesRouter = require("./routes/story");
const commentRouter = require("./routes/comment");

const connectDB = require("./db/connect");
const User = require("./models/user");
const app = express();
let dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/storyBooks";
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const store = new MongoStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

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

// home page
app.get("/", (req, res) => {
    return res.render("home", { title: "StoryBooks" });
});

// Routers
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/stories", storiesRouter);
app.use("/stories/:id/comments", commentRouter);

app.use("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    console.log(err);
    res.status(status).render("error", { error: err, title: "Error " });
});

const start = async () => {
    try {
        await connectDB(dbUrl);
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`>>> Serving at port ${port}... !!!`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
