const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");
const userInfoSchema = {
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
    },
    likedStories: [
        {
            type: Schema.Types.ObjectId,
            ref: "Story",
        },
    ],
    savedStories: [
        {
            story: {
                type: Schema.Types.ObjectId,
                ref: "Story",
            },
            savedAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
    likedComments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment",
        },
    ],
    flowedAuthors: [
        {
            author: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            flowedAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
};
const userSchema = new Schema({
    google: {
        profileId: {
            type: String,
            required: true,
        },
        ...userInfoSchema,
    },
});
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("createdDate").get(function () {
    return moment(this.createdAt).format("MMMM Do YYYY, h:mm:ss a");
});
module.exports = mongoose.model("User", userSchema);
