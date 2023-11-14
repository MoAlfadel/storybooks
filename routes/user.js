const express = require("express");
const router = express.Router();
const passport = require("passport");
const { dashboard, renderLoginPage } = require("../controllers/user");

router.route("/login").get(renderLoginPage);
router.route("/dashboard").get(dashboard);
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
        res.send(`${req.user.fullName} \n ${req.user.createdDate}`);
    }
);
module.exports = router;
