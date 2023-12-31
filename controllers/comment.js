const Comment = require("../models/comment");
const Story = require("../models/story");
const catchAsync = require("../utils/CatchAsync");

module.exports.createComment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "Can not find that Story ");
    }
    let comment = new Comment({
        ...req.body.comment,
        author: req.user._id,
        createdAt: Date.now(),
    });
    story.comments.unshift(comment.id);
    await story.save();
    await comment.save();
    req.flash("success", "create comment");
    res.redirect(`/stories/${id}`);
});

module.exports.deleteComment = catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
        req.flash("error", "Can not find that comment");
        return res.redirect(`/stories/${id}`);
    }
    await Story.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    res.redirect(`/stories/${id}`);
});

module.exports.likeComment = catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        req.flash("error", "can not find that comment");
        return res.redirect(`/stories/${id}`);
    }
    if (req.user.likedComments.includes(commentId)) {
        req.flash("error", "You already like that Comment");
        return res.redirect(`/stories/${id}`);
    }
    comment.likes++;
    req.user.likedComments.unshift(commentId);
    await req.user.save();
    await comment.save();
    res.redirect(`/stories/${id}`);
});

module.exports.dislikeComment = catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        req.flash("error", "not found comments");
        return res.redirect(`/stories/${id}`);
    }
    if (!req.user.likedComments.includes(commentId)) {
        req.flash("error", "You do not like that Comment");
        return res.redirect(`/stories/${id}`);
    }
    comment.likes--;
    const commentIndex = req.user.likedComments.indexOf(comment);
    req.user.likedComments.splice(commentIndex);
    await req.user.save();
    await comment.save();
    res.redirect(`/stories/${id}`);
});
