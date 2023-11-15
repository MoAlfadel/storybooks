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
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required : true ,
    },
});

module.exports = mongoose.model("Comment", commentSchema);
