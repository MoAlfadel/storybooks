const express = require("express");
const router = express.Router({ mergeParams: true });
const comments = require("../controllers/comment");

// but this middleware
const {
    validateComment,
    isLogin,
    isCommentAuthor,
} = require("../middleware/middleware");

// stories/:id/comments
router.route("/").post(comments.createComment);
router.route("/:commentId").delete(comments.deleteComment);

router.post("/:commentId/like", comments.likeComment);

router.delete("/:commentId/dislike", comments.dislikeComment);

module.exports = router;
