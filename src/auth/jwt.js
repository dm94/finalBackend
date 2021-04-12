const JWT = require("jsonwebtoken");
const moment = require("moment");

require("dotenv").config();

const authJWT = {};
authJWT.createToken = (user) => {
  let exp_token = moment().add(7, "days").unix();
  return [
    JWT.sign(
      {
        sub: user._id,
        iat: moment().unix(),
        exp: exp_token,
      },
      process.env.SERVER_SECRET
    ),
    exp_token,
  ];
};
module.exports = authJWT;
