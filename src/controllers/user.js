const controller = {};
const User = require("../models/user");
const Token = require("../models/token");
const authJWT = require("../auth/jwt");
const mailerController = require("./mailer");
const userValidator = require("../validators/user");
const Product = require("../models/product");
const crypto = require("crypto");

controller.addUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const dateOfBirth = req.body.dateOfBirth;

  if (!email || !password) {
    return res.status(400).send();
  }

  try {
    const other = await User.findOne({ email: email });
    if (other) {
      return res.status(409).send("This email already exists");
    }

    let validation = userValidator.validatePass(email);

    if (validation == null || validation.error) {
      const error = validation.error.details[0].message;
      return res.status(400).send(error);
    } else {
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
    }
  } catch (err) {
    console.log(err);
    res.status(409).send("This nickname already exists");
  }
};

controller.userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Missing data");
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Incorrect credentials");
    }

    const validate = await user.isValidPassword(password);
    if (!validate) {
      return res.status(401).send("Incorrect credentials");
    }
    const dataToken = authJWT.createToken(user);
    return res.send({
      access_token: dataToken[0],
      expires_in: dataToken[1],
    });
  } catch (err) {
    console.log(err);
    res.status(401).send("Incorrect credentials");
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
    "_id username createDate firstName"
  );

  if (!userData) {
    return res.status(404).send();
  }

  let products = await Product.find({
    publisherId: userData._id,
  });

  let profile = {
    _id: userData._id,
    username: userData.username,
    createDate: userData.createDate,
    firstName: userData.firstName,
    products: products,
  };

  res.status(200).send(profile);
};

controller.updateUser = async (req, res) => {
  let user = req.user;

  if (req.query.action != null) {
    let validation = null;

    if (req.query.action == "updateimage") {
      validation = userValidator.validateImage(req.body);
      user.image = req.body.image;
    } else if (req.query.action == "updateprofile") {
      validation = userValidator.validateProfile(req.body);
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.location = req.body.location;
    } else if (req.query.action == "updatedate") {
      validation = userValidator.validateDate(req.body);
      user.dateOfBirth = req.body.dateOfBirth;
    } else if (req.query.action == "updateemail") {
      validation = userValidator.validateEmail(req.body);
      try {
        const other = await User.findOne({ email: email });
        if (other) {
          return res.status(409).send("This email already exists");
        }
        let token = new Token({
          _userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        await token.save();
        mailerController.sendTokenEmail(email, token.token);
      } catch (err) {
        return res.status(503).send("Service Unavailable");
      }
      user.email = req.body.email;
      user.emailVerified = false;
    } else if (req.query.action == "updatepass") {
      validation = userValidator.validateEmail(req.body);
      user.password = req.body.password;
    }

    if (validation == null || validation.error) {
      const error = validation.error.details[0].message;
      return res.status(400).send(error);
    } else {
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        Token.findByIdAndDelete(token);
        res.status(200).send("User update");
      });
    }
  } else {
    res.status(400).send();
  }
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
