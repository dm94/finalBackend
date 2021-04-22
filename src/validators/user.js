const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const profileSchema = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20),
  location: Joi.string().min(2).max(200).required(),
});

function validateImage(body) {
  return Joi.object({
    image: Joi.string().uri.required(),
  }).validate({ image: body.image }, { abortEarly: false });
}

function validateDate(body) {
  const now = Date.now();
  const cutoffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);
  return Joi.object({
    dateOfBirth: Joi.date().max(cutoffDate).required(),
  }).validate({ dateOfBirth: body.dateOfBirth }, { abortEarly: false });
}

function validateProfile(body) {
  return profileSchema.validate(
    {
      firstName: body.firstName,
      lastName: body.lastName,
      location: body.location,
    },
    { abortEarly: false }
  );
}

function validateEmail(body) {
  return Joi.object({
    email: Joi.string().email().required(),
  }).validate({ email: body.email }, { abortEarly: false });
}

function validatePass(body) {
  return Joi.object({
    password: new PasswordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }),
  }).validate({ password: body.password }, { abortEarly: false });
}

module.exports = {
  validateProfile,
  validateImage,
  validateDate,
  validateEmail,
  validatePass,
};
