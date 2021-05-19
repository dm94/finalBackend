const helper = {};
const nodemailer = require("nodemailer");
require("dotenv").config();

let transport = null;

if (process.env.MAIL_TEST_SERVER) {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
    }
    transport = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  });
} else {
  transport = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

helper.send = (subject, to, text, html) => {
  return new Promise((resolve, reject) => {
    try {
      const from = process.env.MAIL_DIRECTION;
      transport.sendMail({ from, subject, to, text, html }, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }
        resolve(info);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = helper;
