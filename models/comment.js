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
        min: 0,
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
commentSchema.virtual("createdDate").get(function () {
    return moment(this.createdAt, "YYYYMMDD").fromNow();
});
// [problem] delete comment delete it form stories
// delet it from user liked comment
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
