const controller = {};
const User = require("../models/user");
const authJWT = require("../auth/jwt");
const mailerController = require("./mailer");

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
    res.status(400).send("Faltan datos");
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).send("Credenciales incorrectas");
      return;
    }

    const validate = await user.isValidPassword(password);
    if (!validate) {
      res.status(401).send("Credenciales incorrectas");
      return;
    }
    const dataToken = authJWT.createToken(user);
    return res.send({
      access_token: dataToken[0],
      expires_in: dataToken[1],
    });
  } catch (err) {
    console.log(err);
    res.status(401).send("Credenciales incorrectas");
    return;
  }
};

controller.getUser = async (req, res) => {
  res.send(req.user);
};

controller.confirmationEmail = async (req, res) => {};

controller.resendTokenEmail = async (req, res) => {
  let email = "User Email";
  let token = "fdgdfgdfgdfg";

  /**
   * Here generate a new token to send by mail
   */

  try {
    let code = await mailerController.sendTokenEmail(email, token);
    res.status(code).send();
  } catch (error) {
    res.status(500).send({ error: "Error al enviar el email" });
  }
};

controller.getUserProfile = async (req, res) => {
  const userProfile = req.params.username;

  const userData = await User.findOne({ username: userProfile }).select(
    "username createDate firstName -_id"
  );
  console.log(userData);
  let profile = userData;

  /* Here we will make a request for product information */

  profile.products = [];

  res.status(200).send(profile);
};

controller.updateUser = async (req, res) => {};

controller.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).send("No se ha podido borrar el usuario");
  }
};

module.exports = controller;
