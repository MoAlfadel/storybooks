const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/user");

router.route("/login").get(users.renderLoginPage);
router.route("/dashboard").get(users.dashboard);
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
router.route("/logout").get(users.logout);
module.exports = router;
