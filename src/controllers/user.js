const controller = {};
const User = require("../models/user");
const Token = require("../models/token");
const authJWT = require("../auth/jwt");
const mailerController = require("./mailer");
const crypto = require("crypto");

controller.addUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const dateOfBirth = req.body.dateOfBirth;

  if (!email || !password) {
    res.status(400).send();
    return;
  }

  try {
    const other = await User.findOne({ email: email });
    if (other) {
      res.status(409).send("Ese correo ya existe");
      return;
    }

    const user = new User({
      email: email,
      password: password,
      username: username,
      dateOfBirth: dateOfBirth,
    });
    await user.save();
    const data = await User.findOne({ email: email });
    let token = new Token({
      _userId: data._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();
    mailerController.sendTokenEmail(email, token.token);
    res.status(201).send(data);
  } catch (err) {
    console.log(err);
    res.status(409).send("Ese nick ya existe");
  }
};

controller.userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("Missing data");
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).send("Incorrect credentials");
      return;
    }

    const validate = await user.isValidPassword(password);
    if (!validate) {
      res.status(401).send("Incorrect credentials");
      return;
    }
    const dataToken = authJWT.createToken(user);
    return res.send({
      access_token: dataToken[0],
      expires_in: dataToken[1],
    });
  } catch (err) {
    console.log(err);
    res.status(401).send("Incorrect credentials");
    return;
  }
};

controller.getUser = async (req, res) => {
  res.send(req.user);
};

controller.confirmationEmail = async (req, res) => {
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (!token) {
      return res.status(400).send("A token is required for verification");
    }
    let user = req.user;
    if (user.emailVerified) {
      return res.status(405).send("This user has already been verified");
    }

    user.emailVerified = true;
    user.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      Token.findByIdAndDelete(token);
      res.status(200).send("The account has been verified");
    });
  });
};

controller.resendTokenEmail = async (req, res) => {
  let token = new Token({
    _userId: req.user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  try {
    token.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      let code = mailerController.sendTokenEmail(req.user.email, token.token);
      res.status(code).send();
    });
  } catch (error) {
    res.status(500).send({ error: "Error sending email" });
  }
};

controller.getUserProfile = async (req, res) => {
  const userProfile = req.params.username;

  const userData = await User.findOne({ username: userProfile }).select(
    "username createDate firstName -_id"
  );
  let profile = userData;

  /* Here we will make a request for product information */

  profile.products = [];

  res.status(200).send(profile);
};

controller.updateUser = async (req, res) => {
  res.status(200).send();
};

controller.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).send("User could not be deleted");
  }
};

module.exports = controller;
