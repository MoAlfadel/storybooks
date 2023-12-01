const express = require("express");
const app = express();

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const scriptSrcUrls = [];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = ["https://events.mapbox.com"];
const fontSrcUrls = ["https://fonts.gstatic.com/"];

app.use(mongoSanitize());
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                //
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
