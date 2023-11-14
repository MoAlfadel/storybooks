const joi = require("joi");

module.exports.storyValidationSchema = joi.object({
    title: joi.string().required(),
    body: joi.string().required(),
    status: joi.string().required(),
});

module.exports.commentValidationSchema = joi.object({
    body: joi.string().required(),
});
