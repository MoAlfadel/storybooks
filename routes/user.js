const express = require("express");
const router = express.Router();
const users = require("../controllers/user");

// /users

router.route("/dashboard").get(users.dashboard);
router.route("/:id").get(users.getUser);

module.exports = router;
