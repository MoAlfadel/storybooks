const mongoose = require("mongoose");
const moment = require("moment");
const { Schema } = mongoose;

const commentSchema = new Schema({
    body: {
        type: String,
        trim: true,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
