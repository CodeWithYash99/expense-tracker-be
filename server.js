const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./src/routes/authRoute");

const MONGODB_URI =
  "mongodb+srv://yash:yash1234@cluster0.nby9olz.mongodb.net/expense-tracker";

const app = express();
const PORT = 3001;

app.use(
  session({
    secret: "jwt-secret-token",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`EXPENSE TRACKER DB CONNECTED...`);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("DB connection error: " + err.message));
