const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  image: Joi.string().uri(),
  category: Joi.string(),
  size: Joi.string(),
  price: Joi.number().min(0.01).required(),
  climate: Joi.string(),
  type: Joi.string().valid("plant", "insect").required(),
  description: Joi.string().min(2).max(500),
});

function validate(body) {
  return schema.validate(
    {
      image: body.image,
      title: body.title,
      category: body.specie,
      size: body.size,
      price: body.price,
      climate: body.climate,
      type: body.type,
      description: body.description,
    },
    { abortEarly: false }
  );
}

module.exports = { validate };
