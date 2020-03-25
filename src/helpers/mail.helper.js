import nodemailer from 'nodemailer'
// async..await is not allowed in global scope, must use a wrapper
async function mail(recipe, message) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.EMAIL_PORT || 587),
    secure: !!process.env.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL || testAccount.user, // generated ethereal user
      pass: process.env.USER_PASSWORD || testAccount.pass // generated ethereal password
    }
  });


  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Asociación la Forja 🏕" <${process.env.EMAIL_FROM}>`, // sender address
    to: recipe, // list of receivers
    subject: "New Account ✔", // Subject line
    text: "LaForja!", // plain text body
    html:message // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  return info
}
export default mail