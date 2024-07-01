const ejs = require("ejs");
const nodemailer = require("nodemailer");
const constant = require("../config/constant");
const message = require("../config/cms.message").cmsMessage;
const status = require("../config/status").status;

var sendmail = async function (res, email, subject, mailbody, attachments = "") {
  try {
    // Log the environment variables to verify they are correctly set
    console.log('LOGOURL:', process.env.LOGOURL);
    console.log('APPNAME:', process.env.APPNAME);
    console.log('APPCOLOR:', process.env.APPCOLOR);

    // Create transporter object
    var transporter = nodemailer.createTransport({
      service: constant.MAIL_SERVICE,
      host: constant.MAIL_HOST,
      port: constant.MAIL_PORT,
      secureConnection: false,
      auth: {
        user: constant.MAIL_FROM,
        pass: constant.MAIL_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    // Verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log('Error connecting to email server:', error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    // Render the email template
    let html_data = await ejs.renderFile(__dirname + "/email.ejs", {
      TITLE: subject,
      HTML_BODY: mailbody,
      LOGOURL: process.env.LOGOURL,
      APPNAME: process.env.APPNAME,
      APPCOLOR: process.env.APPCOLOR,
    });

    // Log the rendered HTML for debugging
    console.log('Rendered HTML:', html_data);

    // Mail options
    let mailoption = {
      from: '"My event advisor" <info@myeventadvisor.com>',
      to: email,
      html: html_data,
      subject: subject,
    };

    // Attachments
    if (attachments) {
      mailoption.attachments = attachments;
    }

    // Send the email
    let mailresponse = await transporter.sendMail(mailoption);

    // Log the response from the email server
    console.log('Email sent:', mailresponse);

    return mailresponse;
  } catch (error) {
    console.log("Error sending email:", error);

    return res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
      error: error,
      message: message.INTERNALSERVERERROR,
      status: status.ERROR,
    });
  }
};

exports.sendmail = sendmail;
