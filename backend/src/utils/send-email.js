const nodemailer = require('nodemailer');
const settingService = require('../services/setting.service');

class EmailService {
  constructor() {
    this.client = null;
  }

  async init() {
    const setting = await settingService.getSettings();
    const emailSender = setting.email;
    this.client = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: emailSender,
        pass: 'basrdickzemovlnc',
      },
    });
  }

  sendEmail(from, to, subject, text) {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
    };

    if (this.client) {
      this.client.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } else {
      console.log('Email client is not initialized.');
    }
  }
}

module.exports = EmailService;
