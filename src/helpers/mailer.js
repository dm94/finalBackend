const helper = {};
const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

helper.send = (subject, to, html) => {
  return new Promise((resolve, reject) => {
    try {
      const from = process.env.MAIL_DIRECTION;
      transport.sendMail({ from, subject, to, html }, (error, info) => {
        if (error) {
          console.log("errorSendingEmail: " + JSON.stringify(error));
          reject(error);
          return;
        }

        console.log("emailSent: " + JSON.stringify(info));
        resolve(info);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = helper;
