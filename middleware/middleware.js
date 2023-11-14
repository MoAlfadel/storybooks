const Story = require("../models/story");
const Comment = require("../models/comment");
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

const {
    storyValidationSchema,
    commentValidationSchema,
} = require("../schemas");

module.exports.isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be sign in first ");
        return res.redirect("/auth/login");
    }
    // set the redirect after login
    next();
};

module.exports.isStoryAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story.author.equals(req.user.id)) {
        req.flash("You have mot permission to do that ! ");
        return res.redirect(`/stories/${id}`);
    } else if (!story) {
        res.flash("can not find story ");
        return res.redirect("/stories");
    }
    next();
});
module.exports.validateStory = (req, res, next) => {
    const { error } = storyValidationSchema.validate(req.body.story);
    if (error) {
        let msg = error.details.map((elt) => elt.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isCommentAuthor = catchAsync(async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash("error", "You have mot permission to do that ! ");
        return res.redirect(`/stories/${id}`);
    }
    next();
});

module.exports.validateComment = (req, res, next) => {
    const { error } = commentValidationSchema.validate(req.body.comment);
    if (error) {
        let msg = error.details.map((elt) => elt.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
