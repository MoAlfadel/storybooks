const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../controllers/auth");

router.route("/login").get(auth.renderLoginPage);

router
    .route("/google")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/redirect",
    passport.authenticate("google", {
        failureRedirect: "/auth/login",
        failureFlash: true,
    }),
    function (req, res) {
        res.redirect("/stories");
    }
);
router.route("/logout").get(auth.logout);
module.exports = router;
