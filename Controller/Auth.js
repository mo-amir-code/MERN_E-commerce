const model = require("../Model/User");
const User = model.User;
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../Services/comman");
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const result = await user.save();
        req.login(sanitizeUser(result), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(result), process.env.JWT_SECRET_KEY)
            res.cookie('jwt', token, { expires: new Date(Date.now() + 900000), httpOnly: true })
            res.status(200).json({id:result.id, role:result.role});
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.loginUser = async (req, res) => {
  res.cookie('jwt', req.user.token, { expires: new Date(Date.now() + 900000), httpOnly: true })
  res.json({id:req.user.id, role:req.user.role});
};

exports.checkUser = async (req, res) => {
  try{
    if(req.user){
      res.status(200).json(req.user);
    }else{
      res.status(400)
    }
  }catch(error){
    console.log(error.message)
  }
};

exports.forgotPasswordRequest = async (req, res) => {
  try{
    const user = await User.findOne({email:req.body.email})
    if(user){
    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token
    await user.save()
    
    const resetPageLink = `http://localhost:3000/forgot-password?token=${token}&email=${user.email}`
    const subject = "Reset password of GAZABB ecommerce clothing brand"
    const html = `<p>Click <a href=${resetPageLink} >here</a> to reset your account password</p>`
    const response = await sendMail({to:user.email, subject, html})
    res.status(200).json(response);
  }else{
    res.status(400)
  }
}catch(err){
  console.log(err.message)
}
};

exports.forgotPassword = async (req, res) => {
  try{
    const {email, password, token} = req.body
    const user = await User.findOne({email:email, resetPasswordToken:token})
    if(user){
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword
        user.salt = salt
        user.resetPasswordToken = ""
        await user.save()
      })
      
      const subject = "Reset Password"
      const html = `Your account password has been changed successfully</p>`
      const response = await sendMail({to:user.email, subject, html})
      res.status(200).json(response);
    }else{
      res.status(400)
    }
  }catch(err){
    console.log(err.message)
  }
};

exports.logout = (req, res) => {
  try{
    res.cookie('jwt', null, { expires: new Date(Date.now()), httpOnly: true })
    res.status(200).json("Log out successfull")
  }catch(err){
    res.status(400)
  }
}
