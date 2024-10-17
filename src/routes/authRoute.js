const express = require("express");
const router = express.Router();

const authControl = require("../controllers/authController");

router.post("/signup", authControl.postSignup);
router.post("/login", authControl.postLogin);
router.post("/validate-token", authControl.postValidationToken);
router.post("/add-expense", authControl.postExpense);
router.post("/profile", authControl.postChangeUsername);
router.post("/profile", authControl.postChangePassword);

router.get("/", authControl.getLoggedUsername);
router.get("/my-expenses", authControl.getMyExpenses);

module.exports = router;
