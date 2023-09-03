const passport = require('passport')
const nodemailer = require('nodemailer')

// Email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "mo.amir.code@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});
// End Email Section

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt')
  }

exports.sanitizeUser = (user) => {
    return {id:user.id, role:user.role}
}

exports.cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjI2YWY3ZGE2MjYxNGNkYTI5NWUzOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkzNjA4Nzc0fQ.wFGV37y2x82HGgJSdIJ-IJdRN4iS5OW9ZkmBD9lW7GQ'
  return token;
};

// Mail Endpoint
exports.sendMail = async function({to, subject, html}){
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"E-Commerce" <order@gazabb.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
    // text: "Hello world?", // plain text body
  });
  return info
}