const Story = require("../models/story");
const Comment = require("../models/comment");

module.exports.isLogin = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be sign in first ");
        return res.redirect("/auth/login");
    }
    // set the redirect after login
    next();
};

module.exports.isStoryAuthor = (req, res) => {
    const [id] = req.params;
    const story = Story.findById(id);
    if (!req.user.id.equals(story.author)) {
        req.flash("You have mot permission to do that ! ");
        return res.redirect(`/stories/${id}`);
    } else if (!story) {
        res.flash("can not find story ");
        return res.redirect("/stories");
    }
    next();
};
module.exports.validateStory = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body.story);
    if (error) {
        let msg = error.details.map((elt) => elt.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isCommentAuthor = (req, res) => {
    const [id, commentId] = req.params;
    const comment = Comment.findById(commentId);
    if (!req.user.id.equals(comment.author)) {
        req.flash("You have mot permission to do that ! ");
        return res.redirect(`/stories/${id}`);
    } else if (!story) {
        res.flash("can not find story ");
        return res.redirect("/stories");
    }
    next();
};

module.exports.validateComment = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body.comment);
    if (error) {
        let msg = error.details.map((elt) => elt.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
