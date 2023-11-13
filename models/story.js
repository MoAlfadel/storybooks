const mongoose = require("mongoose");
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
    authorAccountType: {
        // get it From req.user.accountType
        type: String,
        // required : true ,
    },
    author: {
        type: Schema.Types.ObjectId,
        refPath: "authorAccountType",
        // required: true,
    },
});

const Story = mongoose.model("story", StroySchema);

module.exports = Story;
