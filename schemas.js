const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error("string.escapeHTML", { value });
                return clean;
            },
        },
    },
});

const joi = BaseJoi.extend(extension);

module.exports.storyValidationSchema = joi.object({
    title: joi.string().required().escapeHTML(),
    body: joi.string().required(),
    status: joi.string().required().escapeHTML(),
});

module.exports.commentValidationSchema = joi.object({
    body: joi.string().required().escapeHTML(),
});
