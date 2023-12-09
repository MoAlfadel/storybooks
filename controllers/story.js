const Story = require("../models/story");
const catchAsync = require("../utils/CatchAsync");

const isSaveTheStory = (user, story) => {
    if (user)
        return user.savedStories.some((obj) => {
            return obj.story == story.id;
        });
    else return false;
};

module.exports.renderNewStoryForm = (req, res) => {
    res.render("story/new", { title: "New Story " });
};

module.exports.getPublicStories = catchAsync(async (req, res) => {
    const stories = await Story.find({ status: "public" }).populate("author");
    res.render("story/stories", {
        stories,
        title: "All Stories",
        mainTitle: "public stories",
    });
});

module.exports.getFollowedAuthorsStories = catchAsync(async (req, res) => {
    const stories = await Story.find({
        status: "public",
        author: { $in: req.user.getFollowedAuthorsIds() },
    }).populate("author");
    res.render("story/stories", {
        stories,
        title: "Followed Authors Stories",
        mainTitle: "followed authors stories",
    });
});

module.exports.getSavedStories = catchAsync(async (req, res) => {
    const stories = await Story.find({
        _id: { $in: req.user.savedStories.map((elt) => elt.story) },
        status: "public",
    }).populate("author");
    res.render("story/stories", {
        stories,
        title: "saved Stories",
        mainTitle: "saved stories ",
    });
});

module.exports.showStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id)
        .populate({ path: "comments", populate: "author" })
        .populate("author");
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    }
    res.render("story/show", {
        story,
        title: "show Story ",
        isSaved: isSaveTheStory,
    });
});

module.exports.createStory = catchAsync(async (req, res) => {
    const story = new Story({
        ...req.body.story,
        createdAt: Date.now(),
        author: req.user._id,
    });

    await story.save();
    req.flash("success", "successfully made a new story ");
    res.redirect(`/stories/${story.id}`);
});

module.exports.renderEditStoryForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    }
    res.render("story/edit", { story, title: "Edit Stroy " });
});

module.exports.updateStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findByIdAndUpdate(
        id,
        { ...req.body.story },
        { runValidators: true }
    );
    req.flash("success", "Successfully updated a story ");
    res.redirect(`/stories/${id}`);
});

module.exports.deleteStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findByIdAndDelete(id);
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    }
    req.flash("success", "Successfully Deleted story ");
    // [problem] return to ?
    story.status == "public"
        ? res.redirect(`/users/${req.user.id}`)
        : res.redirect("/users/dashboard");
});

module.exports.likeStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    } else if (req.user.likedStories.includes(story.id)) {
        req.flash("error", "Already liked this story!");
        return res.redirect(`/stories/${id}`);
    }
    story.likes++;
    req.user.likedStories.push(story._id);
    await story.save();
    await req.user.save();
    res.redirect(`/stories/${id}`);
});

module.exports.dislikeStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    } else if (!req.user.likedStories.includes(story.id)) {
        req.flash("error", "You do not like this Story before ");
        return res.redirect(`/stories/${id}`);
    }
    story.likes--;
    const storyIndex = req.user.likedStories.indexOf(id);
    req.user.likedStories.splice(storyIndex, 1);
    await story.save();
    await req.user.save();
    res.redirect(`/stories/${id}`);
});

module.exports.saveStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    }
    if (isSaveTheStory(req.user, story)) {
        req.flash("error", "You already save the story ");
        return res.redirect(`/stories/${id}`);
    }

    req.user.savedStories.push({ story: story._id, savedAt: Date.now() });

    await req.user.save();
    req.flash("success", "successfully saved this story ");
    res.redirect(`/stories/${id}`);
});
module.exports.unSaveStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    }
    if (!isSaveTheStory(req.user, story)) {
        req.flash("error", "You do not save the story");
        return res.redirect(`/stories/${id}`);
    }

    await req.user.updateOne({ $pull: { savedStories: { story: story.id } } });
    req.flash("success", "successfully unsaved story ");
    res.redirect(`/stories/${id}`);
});
module.exports.searchStory = catchAsync(async (req, res) => {
    const { q } = req.query;
    let stories = [];

    if (q)
        stories = await Story.find({
            status: "public",
            title: RegExp(q, "ig"),
        }).populate("author");
    res.render("story/search", { title: "Search", q, stories });
});
