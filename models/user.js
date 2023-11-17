const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");
const userInfo = {
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
    ...userInfo,
    google: {
        profileId: {
            type: String,
            required: true,
        },
    },
});
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("createdDate").get(function () {
    return moment(this.createdAt, "YYYYMMDD").fromNow();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
