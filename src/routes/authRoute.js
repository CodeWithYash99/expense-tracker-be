const express = require("express");
const router = express.Router();

const authControl = require("../controllers/authController");

router.post("/signup", authControl.postSignup);
router.post("/login", authControl.postLogin);
router.post("/validate-token", authControl.postValidationToken);
router.post("/add-expense", authControl.postExpense);
router.post("/change-username", authControl.postChangeUsername);
router.post("/change-password", authControl.postChangePassword);
router.post("/reset-password", authControl.postResetPassword);

router.get("/", authControl.getLoggedUsername);
router.get("/my-expenses", authControl.getMyExpenses);

module.exports = router;
