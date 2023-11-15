const mongoose = require("mongoose");
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

const Story = mongoose.model("story", StroySchema);

module.exports = Story;
