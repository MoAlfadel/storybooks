const Story = require("../models/story");
const catchAsync = require("../utils/CatchAsync");

module.exports.renderNewStoryForm = (req, res) => {
    res.render("story/new", { title: "New Story " });
};

module.exports.getPublicStories = catchAsync(async (req, res) => {
    const stories = await Story.find({ status: "public" }).populate("author");
    res.render("story/stories", { stories, title: "All Stories" });
});

module.exports.showStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id)
        .populate("comments")
        .populate("author");
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    }
    res.render("story/show", { story, title: "show Story " });
});

module.exports.createStory = catchAsync(async (req, res) => {
    const story = new Story({
        ...req.body.story,
        author: req.user._id,
    });

    await story.save();
    res.redirect("/stories");
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
    res.redirect(`/stories/${id}`);
});

module.exports.deleteStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findByIdAndDelete(id);
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    }
    res.redirect("/stories");
});

module.exports.likeStory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "Can not find that story");
        return res.redirect("/stories");
    } else if (req.user.likedStories.includes(story.id)) {
        req.flash("error", "You like this Story before ");
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
