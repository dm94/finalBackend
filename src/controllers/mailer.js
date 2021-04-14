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

controller.sendTokenEmail = async (email, token) => {
  /**
   * Here generate a new token to send by mail
   */

  try {
    const subject = "Verifica tu correo en nuestra web";
    const locals = { token: token };
    const html = await emailObj.render("emailVerification.pug", locals);

    await mailer.send(subject, email, html);
    return 204;
  } catch (error) {
    console.log(error);
    return 500;
  }
};
