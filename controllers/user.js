const Story = require("../models/story");
const User = require("../models/user");
const catchAsync = require("../utils/CatchAsync");

module.exports.dashboard = catchAsync(async (req, res) => {
    // find the rqq.user stories => user : req.user.id
    let stories = await Story({
        // user : req.user.id
    });
    res.render("user/dashboard", { title: "Dashboard" });
});

module.exports.getUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("");
    if (!user) {
        req.flash("error", "can not find user ");
        return res.redirect("/home");
    }

    const userStories = await Story.find({ status: "public", author: user.id });
    if (userStories) {
        user.stories = userStories;
    }

    res.render("user/showUser", { user, title: user.fullName });
});
