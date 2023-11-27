const Story = require("../models/story");
const User = require("../models/user");
const catchAsync = require("../utils/CatchAsync");

const isFollowed = (follower, followedUser) => {
    return follower.followedAuthors.some((obj) => {
        return obj.author == followedUser.id;
    });
};

module.exports.dashboard = catchAsync(async (req, res) => {
    const userStories = new Object();

    const followersArr = await req.user.getFollowedByAuthors();
    const followedAuthorsArr = await req.user.getFollowedAuthors();

    userStories.likedStories = await Story.find({
        _id: { $in: req.user.likedStories },
    }).select(["title", "createdAt"]);

    userStories.savedStories = await req.user.getSavedStories();

    userStories.publicStories = await Story.find({
        author: req.user.id,
        status: "public ",
    });
    userStories.privateStories = await Story.find({
        author: req.user.id,
        status: "private",
    }).select(["title", "createdAt"]);

    res.render("user/dashboard", {
        user: req.user,
        followersArr,
        followedAuthorsArr,
        userStories,
        title: "Dashboard",
    });
});
module.exports.getProfile = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        req.flash("error", "can not find that author ");
        return res.redirect("/home");
    }
    const userStories = await Story.find({ status: "public", author: user.id });
    if (userStories) {
        user.stories = userStories;
    }
    const followedBy = await user.getFollowedByAuthors();
    const isFollowedResult = req.user ? isFollowed(req.user, user) : false;

    res.render("user/showUser", {
        user,
        title: user.fullName,
        followedByNumber: followedBy.length,
        isFollowedResult,
    });
});

module.exports.followUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        req.flash("error", "can not find user ");
        return res.redirect("/home");
    }
    const isFollowedResult = isFollowed(req.user, user);

    if (isFollowedResult) {
        req.flash("error", "You already following the author ");
        return res.redirect(`/users/${id}`);
    }
    req.user.followedAuthors.push({ author: user.id, followedAt: Date.now() });
    await req.user.save();
    res.redirect(`/users/${id}`);
});
module.exports.unFollowUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        req.flash("error", "can not find user ");
        return res.redirect("/home");
    }
    const isFollowedResult = isFollowed(req.user, user);

    if (!isFollowedResult) {
        req.flash("error", "You do not follow the author ");
        return res.redirect(`/users/${id}`);
    }
    await req.user.updateOne({
        $pull: { followedAuthors: { author: user.id } },
    });
    res.redirect(`/users/${id}`);
});
