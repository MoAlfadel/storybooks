const express = require("express");
const router = express.Router();
const stories = require("../controllers/story");

// put this middlewares
const { validateStory, isLogin } = require("../middleware/middleware");

router.route("/").get(stories.getPublicStories).post(stories.createStory);

router.route("/new").get(stories.renderNewStoryForm);

router.route("/:id").get(stories.showStory).put(stories.updateStory);

router.route("/:id/like").get(stories.likeStory);
router.route("/:id/dislike").get(stories.likeStory);
router.route("/:id/edit").get(stories.renderEditStoryForm);

module.exports = router;
