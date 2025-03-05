const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  category: { type: String, required: true }, 
  amount: { type: Number, required: true },
  payment_method: { 
    type: String, 
    enum: ["Cash", "UPI", "Bank Transfer"], 
    required: true 
  },
  notes: { type: String } 
});

const IncomeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  source: { 
    type: String, 
    enum: ["Product Sales", "Services", "Donations", "Investments"], 
    required: true 
  },
  amount: { type: Number, required: true },
  payment_method: { 
    type: String, 
    enum: ["Cash", "UPI", "Bank Transfer"], 
    required: true 
  }
});

const FinanceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  budget: { type: Number, required: true }, 
  expenses: [ExpenseSchema], 
  income: [IncomeSchema], 
}, { timestamps: true }); 

const Finance = mongoose.model("Finance", FinanceSchema);

module.exports = Finance;
