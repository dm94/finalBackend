const controller = {};
const mailer = require("../helpers/mailer");
const Email = require("email-templates");
const path = require("path");
const appDir = path.join(__dirname, "../templates/");
const emailObj = new Email({
  views: {
    root: appDir,
  },
});
require("dotenv").config();

controller.sendTokenEmail = async (email, token) => {
  try {
    const subject = "Verifica tu correo en nuestra web";
    const locals = { token: token };
    const text = "Tu codigo de verificación de la cuenta es " + token;

    const html = await emailObj.render("emailVerification.pug", locals);
    await mailer.send(subject, email, text, html);
    return 200;
  } catch (error) {
    console.log(error);
    return 500;
  }
};

controller.sendDeleteAccountEmail = async (user) => {
  try {
    const subject = "Un usuario quiere borrar su cuenta";
    const text =
      "El usuario " + user + " quiere borrar su cuenta de la plataforma";
    await mailer.send(subject, process.env.MAIL_DIRECTION, text, text);
    return 200;
  } catch (error) {
    console.log(error);
    return 500;
  }
};

module.exports = controller;
