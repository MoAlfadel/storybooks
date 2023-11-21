const mongoose = require("mongoose");
const Comment = require("./comment");
const User = require("./user");
const moment = require("moment");

const { Schema } = mongoose;

const StroySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["public", "private"],
        default: "public",
        trim: true,
    },
    createdAt: {
        type: Date,
        trim: true,
        default: Date.now(),
    },
    likes: {
        type: Number,
        default: 0,
        min: 0,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
StroySchema.virtual("createdDate").get(function () {
    return moment(this.createdAt, "YYYYMMDD").fromNow();
});
StroySchema.virtual("storyPart").get(function () {
    if (this.body.length > 100) {
        return this.body.substring(0, 90) + "...";
    } else {
        return this.body;
    }
});

StroySchema.post("findOneAndDelete", async (story) => {
    if (story) {
        // delete its comments
        await Comment.deleteMany({ id: { $in: story.comments } });
        // delete it from likedStories of users
        await User.updateMany({ $pull: { likedStories: story.id } });
        // delete its comment from user likedComments of users
        await User.updateMany({
            $pull: { likedComments: { $in: story.comments } },
        });
        // delete it from savedStories of users
    }
});

const Story = mongoose.model("story", StroySchema);

module.exports = Story;
