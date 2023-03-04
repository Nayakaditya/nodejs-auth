// Import the nodemailer module
const nodemailer = require("nodemailer");

// Create a function that sends an email using nodemailer
const sendEmail = async (option) => {
  // Get the SMTP configuration from the environment variables
  const { SMTP_MAIL, SMTP_PASSWORD, SMTP_SERVICE, SMTP_HOST, SMTP_PORT } =
    process.env;

  // Create a nodemailer transporter object with the SMTP configuration
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_MAIL,
      pass: SMTP_PASSWORD,
    },
  });

  // Set up the email options
  const mailOptions = {
    from: "Nodejs Authn app <adityahelp@hotmail.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
    html: "",
  };

  // Send the email using the nodemailer transporter object
  await transporter.sendMail(mailOptions);
};

// Export the sendEmail function to be used in other modules
module.exports = sendEmail;
