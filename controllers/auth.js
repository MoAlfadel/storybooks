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
