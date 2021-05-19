const controller = {};
const User = require("../models/user");
const Code = require("../models/code");
const authJWT = require("../auth/jwt");
const mailerController = require("./mailer");
const userValidator = require("../validators/user");
const Product = require("../models/product");
const others = require("../helpers/others");
const crypto = require("crypto");

controller.addUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const dateOfBirth = req.body.dateOfBirth;

  if (!email || !password) {
    return res.status(400).send();
  }

  try {
    const other = await User.findOne({ email: email });

    if (other) {
      return res.status(409).send({ error: "This email already exists" });
    }

    let validateSignUp = userValidator.validateSignUp(req.body);

    if (validateSignUp == null || validateSignUp.error) {
      let error = validateSignUp.error.details[0].message;
      return res.status(400).send(error);
    } else {
      const username =
        req.body.firstName +
        req.body.lastName.charAt(0) +
        "-" +
        others.getRandomId(5);

      const user = new User({
        email: email,
        password: password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: username,
        dateOfBirth: dateOfBirth,
      });
      await user.save();
      const data = await User.findOne({ email: email });
      let code = new Code({
        _userId: data._id,
        code: crypto.randomBytes(16).toString("hex"),
      });
      await code.save();
      mailerController.sendTokenEmail(email, code.code);
      res.status(201).send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(409).send({ error: "This nickname already exists" });
  }
};

controller.userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send({ error: "Missing data" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ error: "Incorrect credentials" });
    }

    const dataToken = authJWT.createToken(user);
    return res.send({
      access_token: dataToken[0],
      expires_in: dataToken[1],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.getUser = async (req, res) => {
  try {
    let user = req.user;
    user.password = undefined;

    if (user.deleteAccount) {
      user.deleteAccount = false;
      user.save(function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.confirmationEmail = async (req, res) => {
  try {
    Code.findOne({ code: req.body.code }, function (err, code) {
      if (!code) {
        return res
          .status(400)
          .send({ error: "A token is required for verification" });
      }
      let user = req.user;
      if (user.emailVerified) {
        return res
          .status(405)
          .send({ error: "This user has already been verified" });
      }

      user.emailVerified = true;
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        Code.findByIdAndDelete(code);
        res.status(200).send({ sucess: "The account has been verified" });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.resendTokenEmail = async (req, res) => {
  try {
    Code.findOne({ _userId: req.user._id }, function (err, code) {
      if (code) {
        Code.findByIdAndDelete(code);
      }
    });

    let code = new Code({
      _userId: req.user._id,
      code: crypto.randomBytes(16).toString("hex"),
    });

    code.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      mailerController.sendTokenEmail(req.user.email, code.token);
      res.status(200).send();
    });
  } catch (error) {
    res.status(500).send({ error: "Error sending email" });
  }
};

controller.getUserProfile = async (req, res) => {
  try {
    const userProfile = req.params.username;

    const userData = await User.findOne({ username: userProfile }).select(
      "_id username createDate firstName location"
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
      location: userData.location,
      products: products,
    };

    res.status(200).send(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.updateUser = async (req, res) => {
  try {
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
          const other = await User.findOne({ email: req.body.email });
          if (other) {
            return res.status(409).send({ error: "This email already exists" });
          }
          Token.deleteMany({ _userId: user._id });
          let token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString("hex"),
          });
          await token.save();
          mailerController.sendTokenEmail(req.body.email, token.token);
        } catch (err) {
          console.log(err);
          return res.status(503).send({ error: "Service Unavailable" });
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
          res.status(200).send({ success: "User update" });
        });
      }
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.deleteUser = async (req, res) => {
  try {
    let user = req.user;
    user.deleteAccount = true;
    user.save(function (err) {
      if (err) {
        return res.status(500).send({ error: "User could not be deleted" });
      }
      res.status(204).send();
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "User could not be deleted" });
  }
};

module.exports = controller;
