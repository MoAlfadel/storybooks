const joi = require("joi");
const storyValidationSchema = joi.object({
    title: joi.string().required(),
    body: joi.string().required(),
    status: joi.string().required(),
});

const commentValidationSchema = joi.object({
    body: joi.string().required(),
});

module.exports = storyValidationSchema;
