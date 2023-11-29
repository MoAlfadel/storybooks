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

router.route("/search").get(stories.searchStory);

router
    .route("/followedAuthors")
    .get(isLogin, stories.getFollowedAuthorsStories);

router.route("/saved").get(isLogin, stories.getSavedStories);

router
    .route("/:id")
    .get(stories.showStory)
    .put(isLogin, isStoryAuthor, stories.updateStory)
    .delete(isLogin, isStoryAuthor, stories.deleteStory);

router
    .route("/:id/edit")
    .get(isLogin, isStoryAuthor, stories.renderEditStoryForm);

router
    .route("/:id/like")
    .post(isLogin, stories.likeStory)
    .delete(isLogin, stories.dislikeStory);

router
    .route("/:id/save")
    .post(isLogin, stories.saveStory)
    .delete(stories.unSaveStory);

module.exports = router;
