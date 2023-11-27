const express = require("express");
const router = express.Router();
const users = require("../controllers/user");
const { isLogin } = require("../middleware/middleware");

// /users

router.route("/dashboard").get(isLogin, users.dashboard);
router.route("/:id").get(users.getProfile);
router
    .route("/:id/follow")
    .post(isLogin, users.followUser)
    .delete(users.unFollowUser);

module.exports = router;
