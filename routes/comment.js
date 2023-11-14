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
router.route("/").post(isLogin, validateComment, comments.createComment);
router
    .route("/:commentId")
    .delete(isLogin, isCommentAuthor, comments.deleteComment);

router.post("/:commentId/like", isLogin, comments.likeComment);

router.delete("/:commentId/dislike", comments.dislikeComment);

module.exports = router;
