const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  date: { type: Date, required: true },
  paymentType: { type: String, required: true },
  amount: { type: Number, required: true },
  categoryType: { type: String, required: true },
  remarks: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Expense", expenseSchema);
