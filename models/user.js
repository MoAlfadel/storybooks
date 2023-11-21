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
            unique: true,
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
    followedAuthors: [
        {
            author: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true,
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

userSchema.methods.getFollowedByAuthors = async function () {
    const authorsFollowTheUser = await require("./user")
        .find({
            "followedAuthors.author": this.id,
        })
        .populate("followedAuthors.author");
    const followedBy = authorsFollowTheUser.map((authorFollowTheUser) => {
        for (let obj of authorFollowTheUser.followedAuthors) {
            if (obj.author.id == this.id) {
                return {
                    id: obj.author.id,
                    fullName: obj.author.fullName,
                    flowedAt: moment(obj.flowedAt, "YYYYMMDD").fromNow(),
                    // image: obj.author.image,
                };
            }
        }
    });
    return followedBy;
};
userSchema.methods.getFollowedAuthors = async function () {
    const theUser = await require("./user")
        .findById(this.id)
        .populate("followedAuthors.author");
    const userFollowThem = theUser.followedAuthors;
    const followedAuthors = userFollowThem.map((authorObj) => {
        return {
            id: authorObj.author.id,
            fullName: authorObj.author.fullName,
            flowedAt: moment(authorObj.flowedAt, "YYYYMMDD").fromNow(),
            // image: authorObj.author.image,
        };
    });
    return followedAuthors;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
