const Joi = require("joi");

const schema = Joi.object({
  publisherId: Joi.string.required(),
  image: Joi.string().uri,
  title: Joi.string().min(5).max(200).required(),
  specie: Joi.string().min(2),
  size: Joi.string().min(2),
  price: Joi.number().min(0.01).required(),
  climate: Joi.string().min(2),
  type: Joi.string().valid("plant", "insect").required(),
  description: Joi.string().min(2).max(500),
  subspecie: Joi.string().min(2),
});

function validate(body) {
  return schema.validate(
    {
      publisherId: body.idPublisher,
      image: body.image,
      title: body.title,
      specie: body.specie,
      size: body.size,
      price: body.price,
      climate: body.climate,
      type: body.type,
      description: body.description,
      subspecie: body.subspecie,
    },
    { abortEarly: false }
  );
}

module.exports = { validate };
