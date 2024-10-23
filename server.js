const express = require("express");
const mongoose = require("mongoose");
const cors= require("cors")

const authRoutes= require('./src/routes/authRoute')

const MONGO_URI =
  "mongodb+srv://saiteja26:saiteja2626@cluster0.gnqqv.mongodb.net/expense-tracker";

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(authRoutes);

mongoose.connect(MONGO_URI).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(
  (err) => {
    console.log("DB error", err.message)
  }
)
