const Story = require("../models/story");
const catchAsync = require("../utils/CatchAsync");

module.exports.dashboard = catchAsync(async (req, res) => {
    // find the rqq.user stories => user : req.user.id
    let stories = await Story({
        // user : req.user.id
    });
    res.render("user/dashboard", { title: "Dashboard" });
});
module.exports.renderLoginPage = (req, res) => {
    res.render("user/login", { title: "login" });
};

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/");
        }
        req.flash("success", "goodBye!");
        res.redirect("/stories");
    });
};
