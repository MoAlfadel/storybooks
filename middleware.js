const ExpressError = require("./utils/ExpressError.js");
const storyValidationSchema = require("./schemas");

const validateStory = (req, res, next) => {
    const { error } = storyValidationSchema.validate(req.body.story);
    if (error) {
        let msg = error.details.map((elt) => elt.message).join(",");
        next(new ExpressError(msg, 400));
    } else {
        next();
    }
};

module.exports = {
    validateStory,
};
