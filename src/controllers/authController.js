const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const config = require("../config");
const UserModel = require("../models/userModel");
const ExpenseModel = require("../models/expenseModel");

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
          .then((hashedPassword) => {
            const user = new UserModel({
              userName: toUpper,
              email: toLower,
              password: hashedPassword,
            });

            user.save().then(() => {
              res.json({ status: 200, message: "Registered successfully" });
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

  UserModel.findOne({ email })
    .then((userFound) => {
      if (!userFound) {
        return res.json({ status: 401, message: "Invalid Credentials" });
      }
      bcrypt.compare(password, userFound.password).then((isMatch) => {
        if (!isMatch) {
          return res.json({ status: 401, message: "Invalid Credentials" });
        }
        const token = jwt.sign(
          { userId: userFound._id.toString(), userName: userFound.userName },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.json({ token: token, message: "Successful" });
      });
    })
    .catch((err) => {
      return res.json({ status: 500, message: err.message });
    });
}

function postValidationToken(req, res, next) {
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

function postExpense(req, res, next) {
  const { date, paymentType, amount, categoryType, remarks } = req.body;

  const token = req.headers.authorization;
  const myToken = token?.split(" ")[1];

  if (myToken) {
    try {
      const verifiedToken = jwt.verify(myToken, JWT_SECRET);

      const newExpense = new ExpenseModel({
        userId: verifiedToken.userId,
        date,
        paymentType,
        amount,
        categoryType,
        remarks,
      });

      newExpense
        .save()
        .then(() => {
          return res.json({
            status: 200,
            message: "Successful",
          });
        })
        .catch((err) => {
          return res.json({ status: 500, message: err.message });
        });
    } catch (error) {
      return res.json({ status: 401, message: error.message });
    }
  } else {
    return res.json({ status: 401, message: "Token not received" });
  }
}

async function getMyExpenses(req, res, next) {
  const token = req.headers.authorization;
  const myToken = token?.split(" ")[1];

  if (myToken) {
    try {
      const verifiedToken = jwt.verify(myToken, JWT_SECRET);
      const loggedUser = verifiedToken.userId;

      await ExpenseModel.find({ userId: loggedUser })
        .then((data) => {
          return res.json({
            status: 200,
            message: "Data fetched successfully",
            expenses: data,
          });
        })
        .catch((err) => {
          return res.json({ status: 500, message: err.message });
        });
    } catch (err) {
      return res.json({ status: 401, message: err.message });
    }
  } else {
    return res.json({ status: 401, message: "Token not received" });
  }
}

async function getLoggedUsername(req, res, next) {
  const token = req.headers.authorization;
  const myToken = token?.split(" ")[1];

  if (myToken) {
    try {
      const verifiedToken = jwt.verify(myToken, JWT_SECRET);
      const loggedUser = verifiedToken.userName;

      await UserModel.find({ userName: loggedUser })
        .then((data) => {
          return res.json({
            status: 200,
            message: "Data fetched successfully",
            username: data,
          });
        })
        .catch((err) => {
          return res.json({ status: 500, message: err.message });
        });
    } catch (error) {
      return res.json({ status: 401, message: error.message });
    }
  } else {
    return res.json({ status: 401, message: "Token not received" });
  }
}

function postChangeUsername(req, res, next) {
  const { username } = req.body;
  console.log(username);

  // const token = req.headers.authorization;
  // const myToken = token?.split(" ")[1];

  // UserModel.findOne({})
  //   .then(() => {})
  //   .catch(() => {});
}

function postChangePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;
  console.log(currentPassword, newPassword);
}

module.exports = {
  postSignup,
  postLogin,
  postValidationToken,
  postExpense,
  getMyExpenses,
  getLoggedUsername,
  postChangeUsername,
  postChangePassword,
};
