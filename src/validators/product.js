const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  image: Joi.string().uri(),
  price: Joi.number().min(0.01).required(),
  type: Joi.string().valid("plant", "insect").required(),
  description: Joi.string().min(2).max(500),
});

function validate(body) {
  return schema.validate(
    {
      image: body.image,
      title: body.title,
      price: body.price,
      type: body.type,
      description: body.description,
    },
    { abortEarly: false }
  );
}

module.exports = { validate };
