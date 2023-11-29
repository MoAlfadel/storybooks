const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");
const Story = require("./story");
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
        required: true,
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
                required: true,
            },
            savedAt: {
                type: Date,
                required: true,
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
            followedAt: {
                type: Date,
                required: true,
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
                    followedAt: moment(obj.followedAt, "YYYYMMDD").fromNow(),
                    // image: obj.author.image,
                };
            }
        }
    });
    return followedBy;
};
userSchema.methods.getFollowedAuthors = async function () {
    const theUser = await mongoose
        .model("User", userSchema)
        .findById(this.id)
        .populate("followedAuthors.author");
    const userFollowThem = theUser.followedAuthors;
    const followedAuthors = userFollowThem.map((authorObj) => {
        return {
            id: authorObj.author.id,
            fullName: authorObj.author.fullName,
            followedAt: moment(authorObj.followedAt, "YYYYMMDD").fromNow(),
            // image: authorObj.author.image,
        };
    });
    return followedAuthors;
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
            followedAt: moment(authorObj.followedAt, "YYYYMMDD").fromNow(),
            // image: authorObj.author.image,
        };
    });
    return followedAuthors;
};
userSchema.methods.getSavedStories = async function () {
    const theUser = await require("./user")
        .findById(this.id)
        .populate("savedStories.story");
    if (theUser.savedStories.length)
        return theUser.savedStories.map((obj) => {
            return {
                id: obj.story.id,
                title: obj.story.title,
                savedAt: moment(obj.savedAt, "YYYYMMDD").fromNow(),
            };
        });
    return [];
};
userSchema.methods.getFollowedAuthorsIds = function () {
    return this.followedAuthors.map((obj) => obj.author);
};
const User = mongoose.model("User", userSchema);
module.exports = User;

// do not display flow or the user
// <% if(currentUser.id !== user.id) {%>

// <% } %>
