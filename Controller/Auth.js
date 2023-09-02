const model = require("../Model/User");
const User = model.User;
const crypto = require("crypto");
const { sanitizeUser } = require("../Services/comman");
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
  if(req.user){
    res.status(200).json(req.user);
  }else{
    res.status(400)
  }
};
