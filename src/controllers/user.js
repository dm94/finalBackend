const controller = {};
const User = require("../models/user");
const authJWT = require("../auth/jwt");

controller.addUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send();
    return;
  }

  try {
    const user = new User({ email: email, password: password });
    await user.save();
    const data = await User.findOne({ email: email });
    res.send({ status: "ok", data: data });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

controller.userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(401).send("Credenciales incorrectas");
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
  res.send({ status: "ok", data: req.user });
};

controller.getUserProfile = async (req, res) => {};

controller.updateUser = async (req, res) => {};

controller.deleteUser = async (req, res) => {};

module.exports = controller;
