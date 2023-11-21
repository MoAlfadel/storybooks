const express = require("express");
const router = express.Router();
const stories = require("../controllers/story");

// put this middlewares
const {
    validateStory,
    isLogin,
    isStoryAuthor,
} = require("../middleware/middleware");

router
    .route("/")
    .get(stories.getPublicStories)
    .post(validateStory, stories.createStory);

router.route("/new").get(isLogin, stories.renderNewStoryForm);

router
    .route("/:id")
    .get(stories.showStory)
    .put(isLogin, stories.updateStory)
    .delete(isLogin, isStoryAuthor, stories.deleteStory);

router
    .route("/:id/edit")
    .get(isLogin, isStoryAuthor, stories.renderEditStoryForm);

router.route("/:id/like").get(isLogin, stories.likeStory);
router.route("/:id/dislike").get(isLogin, stories.dislikeStory);

module.exports = router;
