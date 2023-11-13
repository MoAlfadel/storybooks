const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");

const userSchema = new Schema({
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
    email: {
        type: String,
        trim: true,
        required: true,
    },
    profileId: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    accountType: {
        type: String,
        default: "GoogleUser",
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
            authorAccountType: {
                type: String,
                required: true,
                // enum : ["GoogleUser" , ]
            },
            author: {
                type: Schema.Types.ObjectId,
                refPath: "authorAccountType",
                required: true,
            },
            flowedAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
});
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("createdDate").get(function () {
    return moment(this.createdAt).format("MMMM Do YYYY, h:mm:ss a");
});
module.exports.GoogleUser = mongoose.model("GoogleUser", userSchema);
