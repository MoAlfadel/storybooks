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
    authorAccountType: {
        // get it From req.user.accountType
        type: String,
        // required : true ,
    },
    author: {
        type: Schema.Types.ObjectId,
        refPath: "authorAccountType",
        // required : true ,
    },
});

module.exports = mongoose.model("Comment", commentSchema);
