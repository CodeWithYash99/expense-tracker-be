const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");

const JWT_SECRET = "jwt-secret-token";

function postSignup(req, res, next) {
  const { username, email, password } = req.body;

  let toUpper;
  toUpper = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

  let toLower;
  toLower = email.toLowerCase();

  UserModel.findOne({ email })
    .then((userFound) => {
      if (!userFound) {
        return bcrypt
          .hash(password, 12)
          .then((hashed) => {
            const user = new UserModel({
              userName: toUpper,
              email: toLower,
              password: hashed,
            });

            user.save().then(() => {
              res.json({
                status: 200,
                message: "Registered Succesfully",
              });
            });
          })
          .catch((err) => {
            return res.json({ status: 500, message: err.message });
          });
      }
      return res.json({ status: 409, message: "Email already registered" });
    })
    .catch((err) => {
      return res.json({ status: 404, message: err.message });
    });
}

function postLogin(req, res, next) {
  const { email, password } = req.body;

  UserModel.findOne({ email }).then((userFound) => {
    if (!userFound) {
      return res.json({ status: 401, message: "Inavalid credentials" });
    }
    bcrypt
      .compare(password, userFound.password)
      .then((isMatch) => {
        if (!isMatch) {
          return res.json({ status: 401, message: "Inavalid credentials" });
        }
        const token = jwt.sign(
          { userId: userFound._id.toString(), userName: userFound.userName },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.json({ token: token, message: "Successful" });
      })
      .catch((err) => {
        return res.json({ status: 500, message: err.message });
      });
  });
}

function validateToken(req, res, next) {
  const token = req.headers.authorization;
  const myToken = token?.split(" ")[1];

  if (myToken) {
    try {
      const verifiedToken = jwt.verify(myToken, JWT_SECRET);
      return res.json({ status: 200, message: true });
    } catch (error) {
      return res.json({ status: 401, message: false });
    }
  } else {
    return res.json({ status: 401, message: false });
  }
}

module.exports = { postSignup, postLogin, validateToken };
